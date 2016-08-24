#!/bin/bash

mkdir -p /var/run/webbase/
nohup $PYTHON_PATH $WEBBASE_ROOT/server/app.py > /var/log/webbase/server.out 2>&1&
echo `pgrep -f "server/app.py"` > /var/run/webbase/server.pid
