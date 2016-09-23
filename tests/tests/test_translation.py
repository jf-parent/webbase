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
