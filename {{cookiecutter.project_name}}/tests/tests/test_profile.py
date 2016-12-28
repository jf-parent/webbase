from model.basetest import BaseTest


class Test(BaseTest):

    name = 'Test Profile'

    def run(self, **kwargs):

        self.info_log("Running...")

        user = self.app.register_user()

        # VALIDATE EMAIL NOT VERIFIED
        self.app.go_to_profile()

        self.pdriver.assert_visible(
            "sv:profile_email_not_verified_div",
            "#10"
        )

        # UPDATE NAME
        new_name = self.app.faker.name()
        self.pdriver.find("sv:profile_name_input")\
            .send_keys(new_name, clear=True)

        self.pdriver.find("sv:profile_submit_btn").click()

        self.pdriver.assert_visible(
            "sv:profile_success_banner",
            "#14"
        )

        self.app.assert_user_name_equal(new_name, '#9')

        self.app.refresh()

        self.app.assert_user_name_equal(new_name, '#9')

        # UPDATE EMAIL & GRAVATAR
        self.app.go_to_profile()

        old_user_icon_url = self.pdriver.find("sv:header_user_icon")\
            .get_attribute('href')
        new_email = self.app.faker.email()

        self.pdriver.find("sv:profile_email_input")\
            .send_keys(new_email, clear=True)

        self.pdriver.find("sv:profile_submit_btn").click()

        self.app.refresh()

        self.pdriver.assert_not_present(
            "xp://*[@href = '%s']"
            % old_user_icon_url,
            '#13'
        )

        self.pdriver.assert_present(
            "xp://*[@name = 'email' and @value = '%s']"
            % new_email,
            '#13'
        )

        # UPDATE PASSWORD
        self.app.go_to_profile()

        new_password = self.app.faker.password()

        self.pdriver.find("sv:profile_email_input")\
            .send_keys(user.email, clear=True)

        self.pdriver.find("sv:profile_name_input")\
            .send_keys(user.name, clear=True)

        self.pdriver.find("sv:profile_old_password_input")\
            .send_keys(user.password)

        self.pdriver.find("sv:profile_new_password_input")\
            .send_keys(new_password)

        self.pdriver.find("sv:profile_submit_btn").click()

        self.app.logout()

        self.app.login(
            email=user.email,
            password=new_password
        )

        self.app.assert_user_name_equal(
            user.name,
            "#15"
        )

        # UPDATE PASSWORD EMPTY OLD PASSWORD
        self.app.go_to_profile()

        self.pdriver.find("sv:profile_new_password_input")\
            .send_keys('whatever')

        self.pdriver.find("sv:profile_submit_btn").click()

        self.pdriver.assert_visible(
            "xp://*[@name = 'errorMsg.InvalidRequestException']",
            "#17"
        )

        # UPDATE PASSWORD OLD PASSWORD INVALID
        self.app.refresh()

        self.pdriver.find("sv:profile_old_password_input")\
            .send_keys('whatever')

        self.pdriver.find("sv:profile_new_password_input")\
            .send_keys('whatever')

        self.pdriver.find("sv:profile_submit_btn").click()

        self.pdriver.assert_visible(
            "xp://*[@name = 'errorMsg.WrongEmailOrPasswordException']",
            "#17"
        )

        # INVALID PASSWORD
        self.app.refresh()

        self.pdriver.find("sv:profile_old_password_input")\
            .send_keys('test')

        self.pdriver.assert_visible(
            "sv:profile_submit_btn_disabled",
            "#16"
        )

        # INVALID EMAIL
        self.app.refresh()

        self.pdriver.find("sv:profile_email_input")\
            .send_keys('test', clear=True)

        self.pdriver.assert_visible(
            "sv:profile_submit_btn_disabled",
            "#16"
        )

        # INVALID NAME
        self.app.refresh()

        self.pdriver.find("sv:profile_name_input")\
            .send_keys('u', clear=True)

        self.pdriver.assert_visible(
            "sv:profile_submit_btn_disabled",
            "#16"
        )

        self.pdriver.find("sv:profile_name_input")\
            .send_keys('u'*100, clear=True)

        self.pdriver.assert_present(
            "xp://input[@name = 'name' and @value = '%s']"
            % ('u'*60),
            "#18"
        )

        self.app.logout()
