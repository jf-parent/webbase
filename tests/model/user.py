from brome.core.stateful import Stateful


class User(Stateful):

    def __init__(self, pdriver, email, name, password):
        self.pdriver = pdriver
        self._email = email
        self._name = name
        self._password = password

    @property
    def email(self):
        return self._email

    @property
    def name(self):
        return self._name

    @property
    def password(self):
        return self._password
