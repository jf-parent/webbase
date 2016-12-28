#!/bin/bash

source scripts/env.sh
mkdir -p ${{cookiecutter.project_name|upper}}_PID_PATH
mkdir -p ${{cookiecutter.project_name|upper}}_LOG_PATH
nohup /opt/prometheus/prometheus -config.file /opt/prometheus/prometheus.yml > ${{cookiecutter.project_name|upper}}_LOG_PATH/prometheus.out 2>&1&
echo `pgrep -f "/opt/prometheus/prometheus"` > ${{cookiecutter.project_name|upper}}_PID_PATH/prometheus.pid
