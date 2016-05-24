class ServerBaseException(Exception):
    def get_name(self):
        return self.__repr__().split('(')[0]

class UserAlreadyExistsException(ServerBaseException):
    pass

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
