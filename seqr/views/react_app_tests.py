from django.core.exceptions import ObjectDoesNotExist
from django.urls.base import reverse
import mock

from seqr.views.react_app import main_app, no_login_main_app
from seqr.views.utils.test_utils import AuthenticationTestCase, USER_FIELDS


class DashboardPageTest(AuthenticationTestCase):
    databases = '__all__'
    fixtures = ['users']

    def run_react_page(self, google_enabled):
        url = reverse(main_app)
        self.check_require_login_no_policies(url, login_redirect_url='/login')

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        initial_json = self.get_initial_page_json(response)
        self.assertSetEqual(set(initial_json.keys()), {'meta', 'user'})
        self.assertSetEqual(set(initial_json['user'].keys()), USER_FIELDS)
        self.assertEqual(initial_json['user']['username'], 'test_user_no_policies')
        self.assertEqual(initial_json['meta']['googleLoginEnabled'], google_enabled)

        # test static assets are correctly loaded
        content = response.content.decode('utf-8')
        self.assertRegex(content, r'static/app(-.*)js')
        self.assertRegex(content, r'<link\s+href="/static/app.*css"[^>]*>')

    def test_react_page(self):
        self.run_react_page(False)

    @mock.patch('seqr.views.utils.terra_api_utils.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY', 'test_key')
    def test_react_page_google_enabled(self):
        self.run_react_page(True)

    def test_local_react_page(self):
        url = reverse(no_login_main_app)
        response = self.client.get(url, HTTP_HOST='localhost:3000')
        self.assertEqual(response.status_code, 200)

        content = response.content.decode('utf-8')
        self.assertNotRegex(content, r'static/app(-.*)js')
        self.assertContains(response, 'app.js')
        self.assertNotRegex(content, r'<link\s+href="/static/app.*css"[^>]*>')

    def test_no_login_react_page(self):
        url = reverse(no_login_main_app)

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        initial_json = self.get_initial_page_json(response)
        self.assertListEqual(list(initial_json.keys()), ['meta'])

        # test set password page correctly includes user from token
        response = self.client.get(
            '/users/set_password/pbkdf2_sha256$30000$y85kZgvhQ539$jrEC343555Itp+14w/T7U6u5XUxtpBZXKv8eh4=')
        self.assertEqual(response.status_code, 200)
        initial_json = self.get_initial_page_json(response)
        self.assertSetEqual(set(initial_json.keys()), {'meta', 'newUser'})
        self.assertSetEqual(set(initial_json['newUser'].keys()), USER_FIELDS)
        self.assertEqual(initial_json['newUser']['username'], 'test_user_manager')
        self.assertFalse(initial_json['meta']['googleLoginEnabled'])

        with self.assertRaises(ObjectDoesNotExist):
            self.client.get('/users/set_password/invalid_pwd')

        # Even if page does not require login, include user metadata if logged in
        self.login_analyst_user()
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        initial_json = self.get_initial_page_json(response)
        self.assertSetEqual(set(initial_json.keys()), {'meta', 'user'})
        self.assertSetEqual(set(initial_json['user'].keys()), USER_FIELDS)
        self.assertEqual(initial_json['user']['username'], 'test_user')
