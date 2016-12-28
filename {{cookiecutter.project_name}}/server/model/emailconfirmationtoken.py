from server.model.basetoken import BaseToken


class Emailconfirmationtoken(BaseToken):
    def is_belonging_to_user(self, user):
        return str(self.user_uid) == user.get_uid()
