#!/bin/bash

mkdir -p /var/run/webbase/
nohup /root/.virtualenvs/webbase/bin/rq worker > /var/log/webbase/rqueue.out 2>&1&
echo `pgrep -f "/root/.virtualenvs/webbase/bin/rq"` > /var/run/webbase/rqueue.pid
