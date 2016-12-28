#!/bin/bash

source scripts/env.sh
mkdir -p ${{cookiecutter.project_name|upper}}_PID_PATH
mkdir -p ${{cookiecutter.project_name|upper}}_LOG_PATH
nohup $PYTHON_PATH ${{cookiecutter.project_name|upper}}_ROOT/admin/app.py > ${{cookiecutter.project_name|upper}}_LOG_PATH/admin_server.out 2>&1&
echo `pgrep -f "admin/app.py"` > ${{cookiecutter.project_name|upper}}_PID_PATH/{{cookiecutter.project_name|lower}}_admin.pid
