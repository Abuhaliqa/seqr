"""APIs for management of projects related to AnVIL workspaces."""
import json
import time

from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.models import User
from django.contrib.auth.views import redirect_to_login
from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect

from reference_data.models import GENOME_VERSION_LOOKUP
from seqr.models import Project, CAN_EDIT
from seqr.views.react_app import render_app_html
from seqr.views.utils.json_to_orm_utils import create_model_from_json
from seqr.views.utils.json_utils import create_json_response
from seqr.views.utils.file_utils import load_uploaded_file
from seqr.views.utils.terra_api_utils import add_service_account, has_service_account_access, TerraAPIException, \
    TerraRefreshTokenFailedException
from seqr.views.utils.pedigree_info_utils import parse_pedigree_table
from seqr.views.utils.individual_utils import add_or_update_individuals_and_families
from seqr.utils.communication_utils import send_html_email
from seqr.utils.file_utils import does_file_exist, file_iter
from seqr.utils.logging_utils import SeqrLogger
from seqr.views.utils.permissions_utils import is_anvil_authenticated, check_workspace_perm, login_and_policies_required
from settings import BASE_URL, GOOGLE_LOGIN_REQUIRED_URL, POLICY_REQUIRED_URL, API_POLICY_REQUIRED_URL

logger = SeqrLogger(__name__)

anvil_auth_required = user_passes_test(is_anvil_authenticated, login_url=GOOGLE_LOGIN_REQUIRED_URL)

BLOCK_SIZE = 65536


def get_vcf_samples(vcf_filename):
    byte_range = None if vcf_filename.endswith('.vcf') else (0, BLOCK_SIZE)
    for line in file_iter(vcf_filename, byte_range=byte_range):
        if line[0] != '#':
            break
        if line.startswith('#CHROM'):
            header = line.rstrip().split('FORMAT\t', 2)
            return set(header[1].split('\t')) if len(header) == 2 else {}
    return {}


def anvil_auth_and_policies_required(wrapped_func=None, policy_url=API_POLICY_REQUIRED_URL):
    def decorator(view_func):
        return login_and_policies_required(anvil_auth_required(view_func), login_url=GOOGLE_LOGIN_REQUIRED_URL, policy_url=policy_url)
    if wrapped_func:
        return decorator(wrapped_func)
    return decorator


@anvil_auth_and_policies_required(policy_url=POLICY_REQUIRED_URL)
def anvil_workspace_page(request, namespace, name):
    """
    This view will be requested from AnVIL, it validates the workspace and project before loading data.

    :param request: Django request object.
    :param namespace: The namespace (or the billing account) of the workspace.
    :param name: The name of the workspace. It also be used as the project name.
    :return Redirect to a page depending on if the workspace permissions or project exists.

    """
    project = Project.objects.filter(workspace_namespace=namespace, workspace_name=name)
    if project:
        return redirect('/project/{}/project_page'.format(project.first().guid))

    try:
        check_workspace_perm(request.user, CAN_EDIT, namespace, name, can_share=True)
    except PermissionDenied:
        return render_app_html(request, status=403)
    except TerraRefreshTokenFailedException:
        return redirect_to_login(request.get_full_path(), GOOGLE_LOGIN_REQUIRED_URL)

    return redirect('/create_project_from_workspace/{}/{}'.format(namespace, name))


@anvil_auth_and_policies_required
def create_project_from_workspace(request, namespace, name):
    """
    Create a project when a cooperator requests to load data from an AnVIL workspace.

    :param request: Django request object
    :param namespace: The namespace (or the billing account) of the workspace
    :param name: The name of the workspace. It also be used as the project name
    :return the projectsByGuid with the new project json

    """
    # Validate that the current user has logged in through google and has sufficient permissions
    workspace_meta = check_workspace_perm(request.user, CAN_EDIT, namespace, name, can_share=True, meta_fields=['workspace.bucketName'])

    projects = Project.objects.filter(workspace_namespace=namespace, workspace_name=name)
    if projects:
        error = 'Project "{}" for workspace "{}/{}" exists.'.format(projects.first().name, namespace, name)
        return create_json_response({'error': error}, status=400, reason=error)

    # Validate all the user inputs from the post body
    request_json = json.loads(request.body)

    missing_fields = [field for field in ['genomeVersion', 'uploadedFileId', 'dataPath', 'sampleType'] if not request_json.get(field)]
    if missing_fields:
        error = 'Field(s) "{}" are required'.format(', '.join(missing_fields))
        return create_json_response({'error': error}, status=400, reason=error)

    if not request_json.get('agreeSeqrAccess'):
        error = 'Must agree to grant seqr access to the data in the associated workspace.'
        return create_json_response({'error': error}, status=400, reason=error)

    # Add the seqr service account to the corresponding AnVIL workspace
    added_account_to_workspace = add_service_account(request.user, namespace, name)
    if added_account_to_workspace:
        _wait_for_service_account_access(request.user, namespace, name)

    # Validate the data path
    bucket_name = workspace_meta['workspace']['bucketName']
    data_path = 'gs://{bucket}/{path}'.format(bucket=bucket_name.rstrip('/'), path=request_json['dataPath'].lstrip('/'))
    if not (data_path.endswith('.vcf') or data_path.endswith('.vcf.gz') or data_path.endswith('.vcf.bgz')):
        error = 'Invalid VCF file format - file path must end with .vcf, .vcf.gz, or .vcf.bgz'
        return create_json_response({'error': error}, status=400, reason=error)
    if not does_file_exist(data_path, user=request.user):
        error = 'Data file or path {} is not found.'.format(request_json['dataPath'])
        return create_json_response({'error': error}, status=400, reason=error)

    # Parse families/individuals in the uploaded pedigree file
    json_records = load_uploaded_file(request_json['uploadedFileId'])
    pedigree_records, _ = parse_pedigree_table(json_records, 'uploaded pedigree file', user=request.user, fail_on_warnings=True)

    # Validate the VCF to see if it contains all the required samples
    samples = get_vcf_samples(data_path)
    if not samples:
        return create_json_response(
            {'error': 'No samples found in the provided VCF. This may be due to a malformed file'}, status=400)

    missing_samples = [record['individualId'] for record in pedigree_records if record['individualId'] not in samples]
    if missing_samples:
        return create_json_response(
            {'error': 'The following samples are included in the pedigree file but are missing from the VCF: {}'.format(', '.join(missing_samples))}, status=400)

    # Create a new Project in seqr
    project_args = {
        'name': name,
        'genome_version': request_json['genomeVersion'],
        'description': request_json.get('description', ''),
        'workspace_namespace': namespace,
        'workspace_name': name,
    }

    project = create_model_from_json(Project, project_args, user=request.user)

    # add families and individuals according to the uploaded individual records
    _, updated_individuals = add_or_update_individuals_and_families(
        project, individual_records=pedigree_records, user=request.user
    )

    # Send an email to all seqr data managers
    try:
        _send_load_data_email(project, updated_individuals, data_path, request_json['sampleType'], request.user)
    except Exception as ee:
        message = 'AnVIL loading request email exception: {}'.format(str(ee))
        logger.error(message, request.user)

    return create_json_response({'projectGuid':  project.guid})


def _wait_for_service_account_access(user, namespace, name):
    for _ in range(2):
        time.sleep(3)
        if has_service_account_access(user, namespace, name):
            return True
    raise TerraAPIException('Failed to grant seqr service account access to the workspace', 400)


def _send_load_data_email(project, updated_individuals, data_path, sample_type, user):
    email_content = """
        {user} requested to load {sample_type} data ({genome_version}) from AnVIL workspace "{namespace}/{name}" at 
        "{path}" to seqr project <a href="{base_url}project/{guid}/project_page">{project_name}</a> (guid: {guid})

        The sample IDs to load are attached.    
        """.format(
        user=user.email,
        path=data_path,
        namespace=project.workspace_namespace,
        name=project.workspace_name,
        base_url=BASE_URL,
        guid=project.guid,
        project_name=project.name,
        sample_type=sample_type,
        genome_version=GENOME_VERSION_LOOKUP.get(project.genome_version),
    )

    send_html_email(
        email_content,
        subject='AnVIL data loading request',
        to=sorted([dm.email for dm in User.objects.filter(is_staff=True, is_active=True)]),
        attachments=[(
            '{}_sample_ids.tsv'.format(project.guid),
            '\n'.join([individual.individual_id for individual in updated_individuals])
        )]
    )
