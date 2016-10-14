from model.basetest import BaseTest


class Test(BaseTest):

    name = 'Test Register'

    def run(self, **kwargs):

        self.info_log("Running...")

        email = self.app.faker.email()
        name = self.app.faker.name()
        password = self.app.faker.password()

        # ALREADY HAVE AN ACCOUNT LINK
        self.app.go_to_home()

        self.app.go_to_register()

        self.pdriver.assert_visible(
            "sv:register_already_have_account_link",
            "#19"
        )

        self.pdriver.find(
            "sv:register_already_have_account_link"
        ).click()

        self.app.wait_until_loaded()

        self.pdriver.assert_visible(
            "sv:login_submit_btn",
            "#19"
        )

        # DISABLE / ENABLE SUBMIT BUTTON
        self.app.go_to_register()

        self.pdriver.assert_visible(
            "sv:register_submit_btn_disabled",
            "#20"
        )

        # HAS-WARNING
        self.pdriver.assert_visible(
            "sv:register_name_input_has_warning",
            "#32"
        )

        self.pdriver.assert_visible(
            "sv:register_email_input_has_warning",
            "#32"
        )

        self.pdriver.assert_visible(
            "sv:register_password_input_has_warning",
            "#32"
        )

        # INVALID EMAIL
        self.pdriver.find("sv:register_name_input").send_keys(name)
        self.pdriver.find("sv:register_password_input").send_keys(password)
        self.pdriver.find("sv:register_email_input").send_keys('test')

        self.pdriver.assert_visible(
            "sv:register_name_input_has_success",
            "#32"
        )

        self.pdriver.assert_visible(
            "sv:register_password_input_has_success",
            "#32"
        )

        self.pdriver.assert_visible(
            "sv:register_email_input_has_error",
            "#32"
        )

        self.pdriver.assert_visible(
            "sv:register_submit_btn_disabled",
            "#21"
        )

        # INVALID NAME
        self.app.refresh()

        self.pdriver.find("sv:register_email_input").send_keys(email)
        self.pdriver.find("sv:register_password_input").send_keys(password)
        self.pdriver.find("sv:register_name_input").send_keys('t')

        self.pdriver.assert_visible(
            "sv:register_name_input_has_error",
            "#32"
        )

        self.pdriver.assert_visible(
            "sv:register_password_input_has_success",
            "#32"
        )

        self.pdriver.assert_visible(
            "sv:register_email_input_has_success",
            "#32"
        )

        self.pdriver.assert_visible(
            "sv:register_submit_btn_disabled",
            "#22"
        )

        # INVALID PASSWORD
        self.app.refresh()

        self.pdriver.find("sv:register_email_input").send_keys(email)
        self.pdriver.find("sv:register_name_input").send_keys(name)
        self.pdriver.find("sv:register_password_input").send_keys('test')

        self.pdriver.assert_visible(
            "sv:register_name_input_has_success",
            "#32"
        )

        self.pdriver.assert_visible(
            "sv:register_password_input_has_error",
            "#32"
        )

        self.pdriver.assert_visible(
            "sv:register_email_input_has_success",
            "#32"
        )

        self.pdriver.assert_visible(
            "sv:register_submit_btn_disabled",
            "#23"
        )

        # SUCCESS
        self.app.refresh()
        self.pdriver.find("sv:register_email_input").send_keys(email)
        self.pdriver.find("sv:register_name_input").send_keys(name)
        self.pdriver.find("sv:register_password_input").send_keys(password)

        self.pdriver.find("sv:register_submit_btn").click()

        self.app.wait_until_loaded()

        self.app.assert_user_name_equal(name, '#24')

        self.app.logout()
