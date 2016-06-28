#!/bin/bash

mkdir -p /var/run/webbase/
nohup /root/.virtualenvs/webbase/bin/python /root/PROG/PYTHON/webbase/webbaseserver/app.py > /var/log/webbase/server.out 2>&1&
echo `pgrep -f "webbaseserver/app.py"` > /var/run/webbase/server.pid
