from model.basetest import BaseTest


class Test(BaseTest):

    name = 'Test Privacy Policy'

    def run(self, **kwargs):

        self.info_log("Running...")

        self.app.go_to_home()

        self.pdriver.assert_visible(
            "sv:header_privacy_policy_banner",
            "#31"
        )

        self.pdriver.find(
            "sv:header_privacy_policy_banner_link"
        ).click()

        self.app.wait_until_loaded()

        self.pdriver.assert_visible(
            "sv:privacy_page",
            "#31"
        )

        self.pdriver.find("sv:header_privacy_policy_banner_gotit_btn").click()

        self.pdriver.assert_not_visible(
            "sv:header_privacy_policy_banner",
            "#31"
        )

        self.app.refresh()

        self.pdriver.assert_not_visible(
            "sv:header_privacy_policy_banner",
            "#31"
        )
