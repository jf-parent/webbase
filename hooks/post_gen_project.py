#!/usr/bin/env python

import os
import shutil

PROJECT_DIRECTORY = os.path.realpath(os.path.curdir)


def remove_dir(dirpath):
    shutil.rmtree(os.path.join(PROJECT_DIRECTORY, dirpath))


def remove_file(filepath):
    os.remove(os.path.join(PROJECT_DIRECTORY, filepath))

if __name__ == '__main__':

    # REGISTRATION
    if '{{ cookiecutter.include_registration }}' != 'y':
        remove_dir('client/routes/Register')
        remove_file('server/tests/test_register.py')

    # CORDOVA
    if '{{ cookiecutter.include_cordova }}' != 'y':
        remove_dir('hooks')
        remove_dir('www')
        remove_dir('resources')
        remove_file('config.xml')

    # ELECTRON
    if '{{ cookiecutter.include_electron }}' != 'y':
        remove_file('client/electron.js')
        remove_file('client/package.json')
