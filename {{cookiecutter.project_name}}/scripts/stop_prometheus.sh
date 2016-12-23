#!/bin/bash

source scripts/env.sh
kill `cat ${{cookiecutter.project_name|upper}}_PID_PATH/prometheus.pid`
