#!/bin/bash

nohup cd /root/PROG/PYTHON/webbase && python server/app.py > /var/log/webbase/server.log 2>&1& echo $! > /var/run/webbase/server.pid
