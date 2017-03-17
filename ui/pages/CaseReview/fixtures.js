/** This file contains sample state to use for tests */

/* eslint-disable comma-dangle */

export const STATE1 = {
  familiesByGuid: {
    F011652_1: {
      analysisNotes: 'added note',
      analysisStatus: 'Rcpc',
      analysisSummary: '',
      causalInheritanceMode: 'unknown',
      description: '',
      displayName: '1',
      familyGuid: 'F011652_1',
      familyId: '1',
      internalCaseReviewNotes: '',
      internalCaseReviewSummary: '',
      pedigreeImage: '/media/pedigree_images/1_w677Gyf.png',
    }
  },
  familyGuidToIndivGuids: {
    F011652_1: [
      'I021476_na19678',
      'I021474_na19679',
      'I021475_na19675',
    ]
  },
  individualsByGuid: {
    I021474_na19679: {
      affected: 'N',
      caseReviewStatus: 'I',
      caseReviewStatusLastModifiedBy: null,
      caseReviewStatusLastModifiedDate: null,
      createdDate: '2016-12-05T10:28:21.303Z',
      displayName: '',
      individualGuid: 'I021474_na19679',
      individualId: 'NA19679',
      lastModifiedDate: '2017-03-14T17:37:34.002Z',
      maternalId: '',
      paternalId: '',
      phenotipsData: {
        clinicalStatus: {
          clinicalStatus: 'affected'
        },
        contact: {
          email: 'test@broadinstitute.org',
          name: '1kg',
          user_id: '1kg'
        },
        date: '2016-05-16T06:39:08.000Z',
        date_of_birth: '',
        date_of_death: '',
        ethnicity: {
          maternal_ethnicity: [],
          paternal_ethnicity: []
        },
        external_id: 'NA19679',
        family_history: {},
        features: [
          {
            category: 'HP:0001507',
            id: 'HP:0011405',
            label: 'Childhood onset short-limb short stature',
            observed: 'yes',
            type: 'phenotype'
          },
          {
            category: 'HP:0001507',
            id: 'HP:0004325',
            label: 'Decreased body weight',
            observed: 'yes',
            type: 'phenotype'
          },
          {
            category: 'HP:0040064',
            id: 'HP:0009821',
            label: 'Forearm undergrowth',
            observed: 'yes',
            type: 'phenotype'
          },
          {
            category: 'HP:0003011',
            id: 'HP:0001290',
            label: 'Generalized hypotonia',
            observed: 'yes',
            type: 'phenotype'
          },
          {
            category: 'HP:0000707',
            id: 'HP:0001250',
            label: 'Seizures',
            observed: 'yes',
            type: 'phenotype'
          },
          {
            category: 'HP:0000924',
            id: 'HP:0002652',
            label: 'Skeletal dysplasia',
            observed: 'yes',
            type: 'phenotype'
          }
        ],
        id: 'P0005221',
        last_modification_date: '2016-11-15T20:24:05.000Z',
        last_modified_by: '1kg',
        life_status: 'alive',
        links: {
          href: 'http://localhost:8080/rest/patients/P0005221',
          rel: 'self'
        },
        meta: {
          hgncRemote_version: '2016-11-15T04:51:40.469Z',
          hgnc_version: '2015-08-09T17:45:23.025Z',
          hpo_version: 'releases/2015-09-15',
          omim_version: '2015-10-07T18:26:19.654Z',
          phenotips_version: '1.2.6'
        },
        nonstandard_features: [],
        prenatal_perinatal_history: {},
        prenatal_perinatal_phenotype: {
          negative_prenatal_phenotype: [],
          prenatal_phenotype: []
        },
        report_id: 'P0005221',
        reporter: '1kg',
        sex: 'F',
        solved: {
          status: 'unsolved'
        },
        specificity: {
          date: '2017-03-14T17:37:33.993Z',
          score: 0.8353186513436692,
          server: 'local-omim'
        }
      },
      phenotipsPatientId: 'P0005221',
      sex: 'F'
    },
    I021475_na19675: {
      affected: 'A',
      caseReviewStatus: 'I',
      caseReviewStatusLastModifiedBy: null,
      caseReviewStatusLastModifiedDate: null,
      createdDate: '2016-12-05T10:28:21.303Z',
      displayName: '',
      individualGuid: 'I021475_na19675',
      individualId: 'NA19675',
      lastModifiedDate: '2017-03-14T17:37:33.838Z',
      maternalId: 'NA19679',
      paternalId: 'NA19678',
      phenotipsData: {
        clinicalStatus: {
          clinicalStatus: 'affected'
        },
        contact: {
          email: 'harindra@broadinstitute.org',
          name: '1kg',
          user_id: '1kg'
        },
        date: '2016-05-16T05:37:34.000Z',
        date_of_birth: '',
        date_of_death: '',
        ethnicity: {
          maternal_ethnicity: [],
          paternal_ethnicity: []
        },
        external_id: 'NA19675',
        family_history: {},
        features: [
          {
            category: 'HP:0001626',
            id: 'HP:0001631',
            label: 'Defect in the atrial septum',
            observed: 'no',
            type: 'phenotype'
          },
          {
            category: 'HP:0003011',
            id: 'HP:0001324',
            label: 'Muscle weakness',
            observed: 'yes',
            type: 'phenotype'
          }
        ],
        id: 'P0005219',
        last_modification_date: '2016-12-08T01:30:37.000Z',
        last_modified_by: '1kg',
        life_status: 'alive',
        links: {
          href: 'http://localhost:8080/rest/patients/P0005219',
          rel: 'self'
        },
        meta: {
          hgncRemote_version: '2016-12-07T05:47:00.563Z',
          hgnc_version: '2015-08-09T17:45:23.025Z',
          hpo_version: 'releases/2015-09-15',
          omim_version: '2015-10-07T18:26:19.654Z',
          phenotips_version: '1.2.6'
        },
        nonstandard_features: [],
        prenatal_perinatal_history: {},
        prenatal_perinatal_phenotype: {
          negative_prenatal_phenotype: [],
          prenatal_phenotype: []
        },
        rejectedGenes: [
          {
            comments: '15 genes, lab A, 2013, NGS, negative ',
            gene: 'LGMD panel'
          }
        ],
        report_id: 'P0005219',
        reporter: '1kg',
        sex: 'M',
        solved: {
          status: 'unsolved'
        },
        specificity: {
          date: '2017-03-14T17:37:33.832Z',
          score: 0.34326660169343903,
          server: 'local-omim'
        }
      },
      phenotipsPatientId: 'P0005219',
      sex: 'M'
    },
    I021476_na19678: {
      affected: 'N',
      caseReviewStatus: 'I',
      caseReviewStatusLastModifiedBy: null,
      caseReviewStatusLastModifiedDate: null,
      createdDate: '2016-12-05T10:28:21.303Z',
      displayName: '',
      individualGuid: 'I021476_na19678',
      individualId: 'NA19678',
      lastModifiedDate: '2017-03-14T17:37:33.676Z',
      maternalId: '',
      paternalId: '',
      phenotipsData: {
        clinicalStatus: {
          clinicalStatus: 'affected'
        },
        contact: {
          email: 'test@broadinstitute.org',
          name: '1kg',
          user_id: '1kg'
        },
        date: '2016-05-16T06:39:07.000Z',
        date_of_birth: '',
        date_of_death: '2008-01-01',
        ethnicity: {
          maternal_ethnicity: [],
          paternal_ethnicity: []
        },
        external_id: 'NA19678',
        family_history: {},
        id: 'P0005220',
        last_modification_date: '2016-12-06T23:58:28.000Z',
        last_modified_by: '1kg',
        life_status: 'deceased',
        links: {
          href: 'http://localhost:8080/rest/patients/P0005220',
          rel: 'self'
        },
        meta: {
          hgncRemote_version: '2016-12-06T05:44:36.433Z',
          hgnc_version: '2015-08-09T17:45:23.025Z',
          hpo_version: 'releases/2015-09-15',
          omim_version: '2015-10-07T18:26:19.654Z',
          phenotips_version: '1.2.6'
        },
        prenatal_perinatal_history: {},
        prenatal_perinatal_phenotype: {
          negative_prenatal_phenotype: [],
          prenatal_phenotype: []
        },
        report_id: 'P0005220',
        reporter: '1kg',
        sex: 'M',
        solved: {
          status: 'unsolved'
        },
        specificity: {
          date: '2017-03-14T17:36:11.641Z',
          score: 0,
          server: 'monarchinitiative.org'
        }
      },
      phenotipsPatientId: 'P0005220',
      sex: 'M'
    }
  },
  project: {
    createdDate: '2016-05-16T05:37:08.634Z',
    deprecatedLastAccessedDate: '2017-03-14T15:15:42.580Z',
    deprecatedProjectId: '1kg',
    description: '',
    isMmeEnabled: true,
    isPhenotipsEnabled: true,
    lastModifiedDate: '2017-03-14T17:37:32.712Z',
    mmePrimaryDataOwner: 'PI',
    name: '1000 Genomes Demo',
    phenotipsUserId: '1kg',
    projectCategoryGuids: [],
    projectGuid: 'R0237_1000_genomes_demo'
  },
  user: {
    date_joined: '2015-02-19T20:22:50.633Z',
    email: 'test@broadinstitute.org',
    first_name: '',
    id: 1,
    is_active: true,
    is_staff: true,
    is_superuser: true,
    last_login: '2017-03-14T17:44:53.403Z',
    last_name: '',
    username: 'test'
  },
  caseReviewTableState: {
    familiesFilter: 'ALL',
    familiesSortOrder: 'FAMILY_NAME',
    familiesSortDirection: 1,
    showDetails: true
  },
  editFamilyInfoModal: {
    isVisible: true,
    title: 'test title with unicØde',
    formSubmitUrl: 'http://test/',
  },
  pedigreeZoomModal: {
    isVisible: true,
  },
  viewPhenoTipsModal: {
    isVisible: true,
  },
}
