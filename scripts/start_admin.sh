#!/bin/bash

mkdir -p /var/run/webbase/
nohup $PYTHON_PATH $WEBBASE_ROOT/admin/app.py > /var/log/webbase/admin_server.out 2>&1&
echo `pgrep -f "admin/app.py"` > /var/run/webbase/webbase_admin.pid
