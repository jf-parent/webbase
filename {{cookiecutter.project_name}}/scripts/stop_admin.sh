#!/bin/bash

source scripts/env.sh
kill `cat ${{cookiecutter.project_name|upper}}_PID_PATH/{{cookiecutter.project_name|lower}}_admin.pid`
