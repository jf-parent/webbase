#!/bin/bash

nohup /opt/prometheus/prometheus -config.file /opt/prometheus/prometheus.yml > /var/log/prometheus/prometheus.log 2>&1& echo $! > /var/run/webbase/prometheus.pid
