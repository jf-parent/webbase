
import os
import binascii


def generate_token(n):
    return binascii.hexlify(os.urandom(n)).decode('utf')
