from model.basetest import BaseTest


class Test(BaseTest):

    name = 'Test Login'

    def run(self, **kwargs):

        self.info_log("Running...")

        user = self.app.register_user(logout=True)

        # FORGOTTEN PASSWORD LINK
        self.app.go_to_login()

        self.pdriver.assert_visible(
            "sv:login_forgotten_password_link",
            "#12"
        )

        self.pdriver.find(
            "sv:login_forgotten_password_link"
        ).click()

        self.app.wait_until_loaded()

        self.pdriver.assert_present(
            "sv:forgottenpassword_page",
            "#12"
        )

        # DONT HAVE AN ACCOUNT LINK
        self.app.go_to_login()

        self.pdriver.assert_visible(
            "sv:login_dont_have_account_link",
            "#11"
        )

        self.pdriver.find(
            "sv:login_dont_have_account_link"
        ).click()

        self.app.wait_until_loaded()

        self.pdriver.assert_visible(
            "sv:register_submit_btn",
            "#11"
        )

        # DISABLE / ENABLE SUBMIT BUTTON
        self.app.go_to('login')

        self.pdriver.assert_visible(
            "sv:login_submit_btn_disabled",
            "#4"
        )

        self.pdriver.find("sv:login_email_input").send_keys(user.email)

        self.pdriver.assert_visible(
            "sv:login_submit_btn_disabled",
            "#4"
        )

        self.pdriver.find("sv:login_password_input").send_keys(user.password)

        self.pdriver.assert_not_visible(
            "sv:login_submit_btn_disabled",
            "#5"
        )

        # HAS-WARNING
        self.app.refresh()

        self.pdriver.assert_visible(
            "sv:login_email_input_has_warning",
            "#33"
        )

        self.pdriver.assert_visible(
            "sv:login_password_input_has_warning",
            "#33"
        )

        # INVALID EMAIL
        self.app.go_to('login')

        self.pdriver.find("sv:login_password_input").send_keys(user.password)

        self.pdriver.find("sv:login_email_input").send_keys('test')

        self.pdriver.assert_visible(
            "sv:login_email_input_has_error",
            "#33"
        )

        self.pdriver.assert_visible(
            "sv:login_password_input_has_success",
            "#33"
        )

        self.pdriver.assert_visible(
            "sv:login_submit_btn_disabled",
            "#6"
        )

        # PASSWORD TOO SHORT
        self.app.go_to('login')

        self.pdriver.find("sv:login_email_input").send_keys(user.email)

        self.pdriver.find("sv:login_password_input").send_keys('test')

        self.pdriver.assert_visible(
            "sv:login_email_input_has_success",
            "#33"
        )

        self.pdriver.assert_visible(
            "sv:login_password_input_has_error",
            "#33"
        )

        self.pdriver.assert_visible(
            "sv:login_submit_btn_disabled",
            "#7"
        )

        # INVALID EMAIL / PASSWORD COMBINAISON
        self.app.go_to('login')

        self.pdriver.find("sv:login_email_input")\
            .send_keys('notgoodemail@email.com')

        self.pdriver.find("sv:login_password_input").send_keys('notgoodpw')

        self.pdriver.find("sv:login_submit_btn").click()

        self.pdriver.assert_visible(
            "xp://*[@name = 'errorMsg.WrongEmailOrPasswordException']",
            "#8"
        )

        # SUCCESSFUL LOGIN
        self.app.go_to('login')

        self.app.login(user=user)

        self.pdriver.assert_visible(
            "xp://span[@name= 'user-name' and text() = '%s']"
            % user.name,
            "#1"
        )

        self.app.logout()
