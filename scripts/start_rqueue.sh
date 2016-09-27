#!/bin/bash

source scripts/env.sh
mkdir -p $WEBBASE_PID_PATH
mkdir -p $WEBBASE_LOG_PATH
nohup $RQ_PATH worker > $WEBBASE_LOG_PATH/rqueue.out 2>&1&
echo `pgrep -f "rq"` > $WEBBASE_PID_PATH/rqueue.pid
