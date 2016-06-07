#!/bin/bash

mkdir -p /var/run/webbase/
nohup /root/.virtualenvs/webbase/bin/python /root/PROG/PYTHON/webbase/server/app.py > /var/log/webbase/server.log 2>&1&
echo `pgrep -f "server/app.py"` > /var/run/webbase/server.pid
