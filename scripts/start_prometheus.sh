#!/bin/bash

mkdir -p /var/run/webbase/
nohup /opt/prometheus/prometheus -config.file /opt/prometheus/prometheus.yml > /var/log/prometheus/prometheus.log 2>&1&
echo `pgrep prometheus` > /var/run/webbase/prometheus.pid