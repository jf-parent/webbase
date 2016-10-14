#!/bin/bash

source scripts/env.sh
kill `cat $WEBBASE_PID_PATH/webbase_admin.pid`
