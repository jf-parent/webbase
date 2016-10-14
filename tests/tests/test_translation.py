from model.basetest import BaseTest


class Test(BaseTest):

    name = 'Test Translation'

    def run(self, **kwargs):

        self.info_log("Running...")

        self.app.go_to_home()

        self.app.change_locale('en')

        self.pdriver.assert_visible(
            "xp://*[contains(text(), 'Home')]",
            "#30"
        )

        self.app.change_locale('fr')

        self.pdriver.assert_visible(
            "xp://*[contains(text(), 'acceuil')]",
            "#30"
        )

        user = self.app.register_user()

        self.app.go_to_profile()

        self.app.select_locale_profile('fr')

        self.pdriver.find("sv:profile_submit_btn").click()

        self.app.refresh()

        self.pdriver.assert_visible(
            "xp://span[contains(text(), 'Paramètres profil')]",
            "#35"
        )

        self.app.logout()

        self.app.refresh()

        self.pdriver.assert_visible(
            "xp://*[contains(text(), 'Register')]",
            "#35"
        )

        self.app.login(user)

        self.app.go_to_profile()

        self.pdriver.assert_visible(
            "xp://span[contains(text(), 'Paramètres profil')]",
            "#35"
        )

        self.app.logout()
