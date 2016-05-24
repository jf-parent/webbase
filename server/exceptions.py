class ServerBaseException(Exception):
    def get_name(self):
        return self.__repr__().split('(')[0]


class WrongEmailOrPasswordException(ServerBaseException):
    pass


class EmailAlreadyExistsException(ServerBaseException):
    pass


class InvalidPasswordException(ServerBaseException):
    pass


class InvalidEmailException(ServerBaseException):
    pass


class InvalidUsernameException(ServerBaseException):
    pass


class NotAuthorizedException(ServerBaseException):
    pass
