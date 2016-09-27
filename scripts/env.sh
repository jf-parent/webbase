#!/bin/bash

export WEBBASE_PID_PATH=`cat configs/server.json | jq '.WEBBASE_PID_PATH'`
export PYTHON_PATH=`cat configs/server.json | jq '.PYTHON_PATH'`
export WEBBASE_ROOT=`cat configs/server.json | jq '.WEBBASE_ROOT'`
export WEBBASE_LOG_PATH=`cat configs/server.json | jq '.WEBBASE_LOG_PATH'`
