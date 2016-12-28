#!/bin/bash

export {{cookiecutter.project_name|upper}}_PID_PATH=`cat configs/server.json | jq '.{{cookiecutter.project_name|upper}}_PID_PATH' | tr -d \"`
export PYTHON_PATH=`cat configs/server.json | jq '.PYTHON_PATH' | tr -d \"`
export {{cookiecutter.project_name|upper}}_ROOT=`cat configs/server.json | jq '.{{cookiecutter.project_name|upper}}_ROOT' | tr -d \"`
export {{cookiecutter.project_name|upper}}_LOG_PATH=`cat configs/server.json | jq '.{{cookiecutter.project_name|upper}}_LOG_PATH' | tr -d \"`
