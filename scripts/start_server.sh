#!/bin/bash

mkdir -p $WEBBASE_PID_PATH
nohup $PYTHON_PATH $WEBBASE_ROOT/server/app.py > $WEBBASE_LOG_PATH/server.out 2>&1&
echo `pgrep -f "server/app.py"` > $WEBBASE_PID_PATH/server.pid
