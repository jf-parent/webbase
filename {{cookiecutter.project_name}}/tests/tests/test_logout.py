from model.basetest import BaseTest


class Test(BaseTest):

    name = 'Test Logout'

    def run(self, **kwargs):

        self.info_log("Running...")

        self.app.go_to_home()

        user = self.app.register_user()

        self.app.assert_user_name_equal(user.name, "#2")

        self.app.logout()

        self.pdriver.assert_not_visible(
            "xp://span[@name= 'user-name']",
            "#3"
        )
