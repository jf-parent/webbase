class ServerBaseException(Exception):
    def get_name(self):
        return self.__repr__().split('(')[0]


class WrongEmailOrPasswordException(ServerBaseException):
    pass


class EmailAlreadyExistsException(ServerBaseException):
    pass


class InvalidNameException(ServerBaseException):
    pass


class InvalidPasswordException(ServerBaseException):
    pass


class InvalidEmailException(ServerBaseException):
    pass


class NotAuthorizedException(ServerBaseException):
    pass


class CSRFMismatch(ServerBaseException):
    pass


class InvalidRequestException(ServerBaseException):
    pass


class EmailAlreadyConfirmedException(ServerBaseException):
    pass


class EmailMismatchException(ServerBaseException):
    pass


class TokenExpiredException(ServerBaseException):
    pass


class TokenViolationException(ServerBaseException):
    pass


class TokenAlreadyUsedException(ServerBaseException):
    pass


class TokenInvalidException(ServerBaseException):
    pass


class EmailNotFound(ServerBaseException):
    pass


class ModelImportException(ServerBaseException):
    pass
