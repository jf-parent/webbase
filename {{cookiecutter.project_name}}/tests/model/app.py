from brome.core.settings import BROME_CONFIG
from faker import Faker

from model.basemodel import BaseModel
from model.user import User


class App(BaseModel):

    name = 'App'

    def __init__(self, pdriver):
        self.pdriver = pdriver
        self.faker = Faker()

    ###########################################################################
    # NAVIGATION
    ###########################################################################

    def go_to_home(self):
        self.info_log('Going to home...')

        self.go_to()

    def go_to_login(self):
        self.info_log('Going to the login page...')

        self.pdriver.find("sv:header_login_link").click()

        self.wait_until_loaded()

    def go_to_register(self):
        self.info_log('Going to the register page...')

        self.pdriver.find("sv:header_register_link").click()

        self.wait_until_loaded()

    def go_to_profile(self):
        self.info_log('Going to the profile page...')

        self.open_user_dropdown()

        self.pdriver.find("sv:header_profile_link").click()

        self.wait_until_loaded()

    def open_notification(self):
        self.info_log('Opening notifications...')

    def go_to(self, path=''):
        url = '/'.join([
            BROME_CONFIG['project']['url'],
            path
        ])

        self.pdriver.get(url)

        self.wait_until_loaded()

    ###########################################################################
    # ACTIONS
    ###########################################################################

    def change_locale(self, locale):
        self.info_log('Changing locale...')

        self.pdriver.find(
            "sv:locale_{locale}_btn"
            .format(locale=locale)
        ).click()

    def select_locale_profile(self, locale):
        self.info_log('Selecting locale in profile...')

        locales_map = {
            'fr': 'Français',
            'en': 'English'
        }

        self.pdriver.find(
            "xp://*[contains(@class, 'Select-arrow')]"
        ).click()

        self.pdriver.find(
            "xp://*[contains(@class, 'Select-option') and text() = '%s']"
            % locales_map[locale]
        ).click()

        self.pdriver.find(
            "sv:profile_submit_btn"
        ).click()

    def refresh(self):
        self.pdriver.refresh()

        self.wait_until_loaded()

    def register_user(self, **kwargs):
        """
            kwargs:
                email (string)
                name (string)
                password (string)
                logout (bool)
        """

        self.info_log('Registering user...')

        email = kwargs.get('email', self.faker.email())
        name = kwargs.get('name', self.faker.name())
        password = kwargs.get('password', self.faker.password())
        logout = kwargs.get('logout', False)

        self.go_to_home()

        user = self.register(
            email=email,
            name=name,
            password=password
        )

        if logout:
            self.logout()

        return user

    def open_user_dropdown(self):
        self.info_log('Opening the user dropdown...')

        self.pdriver.find("sv:header_user_dropdown").click()

        self.pdriver.wait_until_present("sv:header_user_dropdown_open")

    def login(self, user=None, email=None, password=None, **kwargs):
        """
            kwargs:
                go_to_login (bool)
        """
        self.info_log('Login...')

        go_to_login = kwargs.get('go_to_login', True)

        _email = None
        _password = None

        if user:
            _email = user.email
            _password = user.password
        elif email and password:
            _email = email
            _password = password
        else:
            raise Exception('Login required either an user instance or an email and a password')  # noqa

        if go_to_login:
            self.go_to_login()

        # EMAIL
        self.pdriver.find("sv:login_email_input").send_keys(_email)

        # PASSWORD
        self.pdriver.find("sv:login_password_input").send_keys(_password)

        self.pdriver.find("sv:login_submit_btn").click()

        self.wait_until_loaded()

    def logout(self):
        self.info_log('Logout...')

        self.open_user_dropdown()

        self.pdriver.find("sv:header_logout_btn").click()

        self.wait_until_loaded()

        self.pdriver.wait_until_visible("sv:header_register_link")

    def register(self, email, name, password):
        self.info_log('Register...')

        self.go_to_register()

        # EMAIL
        self.pdriver.find("sv:register_email_input").send_keys(email)

        # NAME
        self.pdriver.find("sv:register_name_input").send_keys(name)

        # PASSWORD
        self.pdriver.find("sv:register_password_input").send_keys(password)

        self.pdriver.find("sv:register_submit_btn").click()

        self.wait_until_loaded()

        return User(
            self.pdriver,
            email,
            name,
            password
        )

    ###########################################################################
    # WAIT
    ###########################################################################

    def wait_until_loaded(self):
        self.info_log('Waiting until loaded...')

        self.pdriver.wait_until_present('sv:app_root_div')

        self.pdriver.wait_until_not_visible('sv:app_loader')

    ###########################################################################
    # ASSERT
    ###########################################################################

    def assert_user_name_equal(self, value, testid):

        return self.pdriver.assert_text_equal(
            "xp://span[@name= 'user-name']",
            value,
            testid
        )
