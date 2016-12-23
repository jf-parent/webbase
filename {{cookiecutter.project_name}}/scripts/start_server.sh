#!/bin/bash

source scripts/env.sh
mkdir -p ${{cookiecutter.project_name|upper}}_PID_PATH
mkdir -p ${{cookiecutter.project_name|upper}}_LOG_PATH
nohup $PYTHON_PATH ${{cookiecutter.project_name|upper}}_ROOT/server/app.py > ${{cookiecutter.project_name|upper}}_LOG_PATH/server.out 2>&1&
echo `pgrep -f "server/app.py"` > ${{cookiecutter.project_name|upper}}_PID_PATH/server.pid
