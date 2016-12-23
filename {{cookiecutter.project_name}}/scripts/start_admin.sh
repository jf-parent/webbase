#!/bin/bash

source scripts/env.sh
mkdir -p $WEBBASE_PID_PATH
mkdir -p $WEBBASE_LOG_PATH
nohup $PYTHON_PATH $WEBBASE_ROOT/admin/app.py > $WEBBASE_LOG_PATH/admin_server.out 2>&1&
echo `pgrep -f "admin/app.py"` > $WEBBASE_PID_PATH/webbase_admin.pid
