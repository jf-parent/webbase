#!/bin/bash

source scripts/env.sh
kill `cat $WEBBASE_PID_PATH/prometheus.pid`
