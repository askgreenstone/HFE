#!/bin/bash
# 重启测试服务器
# 定义变量
WORKING_DIR="/mnt/apps/cas/"
cd $WORKING_DIR

echo '<----------begin to stop test server!---------->'
stop.sh
echo '<----------Test server already stop!---------->'

echo '<----------begin to restart test server---------->'
start.sh
echo '<----------Test server already restart!---------->'