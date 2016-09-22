from model.basetest import BaseTest


class Test(BaseTest):

    name = 'Test Navigation'

    def create_state(self):
        self.user = self.app.register_user(logout=True)

        return True

    def run(self, **kwargs):

        self.info_log("Running...")

        self.app.go_to_home()

        self.app.login(user=self.user)

        # HISTORY BACK
        self.app.go_to_profile()
        self.app.go_to_home()

        self.pdriver.back()

        self.pdriver.assert_visible("sv:profile_submit_btn", "#25")

        # HISTORY FORWARD
        self.app.refresh()

        self.app.go_to_home()
        self.app.go_to('settings')
        self.app.go_to_profile()

        self.pdriver.back()
        self.pdriver.forward()

        self.pdriver.assert_visible("sv:profile_submit_btn", "#26")

        self.app.logout()

        # GET AUTH URL => LOGIN => REDIRECTION
        self.app.go_to('settings')

        self.pdriver.assert_visible("sv:login_submit_btn", "#28")

        self.app.login(self.user, go_to_login=False)

        self.pdriver.assert_visible("sv:settings_page", "#29")

        self.app.logout()

        # LOGIN => REDIRECTION[DASHBOARD]
        self.app.refresh()

        self.app.login(self.user)

        self.pdriver.assert_visible("sv:dashboard_page", "#27")

        self.app.logout()
