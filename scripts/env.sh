#!/bin/bash

export WEBBASE_PID_PATH=`cat configs/server.json | jq '.WEBBASE_PID_PATH' | tr -d \"`
export PYTHON_PATH=`cat configs/server.json | jq '.PYTHON_PATH' | tr -d \"`
export WEBBASE_ROOT=`cat configs/server.json | jq '.WEBBASE_ROOT' | tr -d \"`
export WEBBASE_LOG_PATH=`cat configs/server.json | jq '.WEBBASE_LOG_PATH' | tr -d \"`
