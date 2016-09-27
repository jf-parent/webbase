#!/bin/bash

source scripts/env.sh
mkdir -p $WEBBASE_PID_PATH
mkdir -p $WEBBASE_LOG_PATH
nohup /opt/prometheus/prometheus -config.file /opt/prometheus/prometheus.yml > $WEBBASE_LOG_PATH/prometheus.out 2>&1&
echo `pgrep -f "/opt/prometheus/prometheus"` > $WEBBASE_PID_PATH/prometheus.pid
