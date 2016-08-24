#!/bin/bash

mkdir -p /var/run/webbase/
nohup $RQ_PATH worker > /var/log/webbase/rqueue.out 2>&1&
echo `pgrep -f "rq"` > /var/run/webbase/rqueue.pid
