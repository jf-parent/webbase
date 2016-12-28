#!/bin/bash

source scripts/env.sh
mkdir -p ${{cookiecutter.project_name|upper}}_PID_PATH
mkdir -p ${{cookiecutter.project_name|upper}}_LOG_PATH
nohup $RQ_PATH worker > ${{cookiecutter.project_name|upper}}_LOG_PATH/rqueue.out 2>&1&
echo `pgrep -f "rq"` > ${{cookiecutter.project_name|upper}}_PID_PATH/rqueue.pid
