#!/bin/bash
set -e


# 更新系统级环境变量，NODE_ENV写在里面
source /etc/environment

WORKING_DIR="/mnt/web/"
REPO_NAME="HFE"


cd $WORKING_DIR


if [[ ! -d $REPO_NAME ]]; then
    git clone -b master https://askgreenstone:lskj2014@github.com/askgreenstone/HFE.git
else
    cd $WORKING_DIR/$REPO_NAME
    git pull origin master
fi


cd $WORKING_DIR/$REPO_NAME
npm install
cd $WORKING_DIR/$REPO_NAME/mobile
npm install

# 如果log目录不存在，新建之
mkdir -p /mnt/web/wap/web/log

cd $WORKING_DIR/$REPO_NAME
gulp

