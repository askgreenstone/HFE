#!/bin/bash
set -e

echo '<----------server.sh is running!---------->'
# 更新系统级环境变量，NODE_ENV写在里面
source /etc/environment

WORKING_DIR="/mnt/web/"
REPO_NAME="HFE"


cd $WORKING_DIR


if [[ ! -d $REPO_NAME ]]; then
	echo '<----------begin to clone HFE.git!---------->'
    git clone -b master https://askgreenstone:lskj2014@github.com/askgreenstone/HFE.git
    echo '<----------HFE clone complete!---------->'
else
    cd $WORKING_DIR/$REPO_NAME
    echo '<----------begin to pull HFE.git!---------->'
    git pull origin master
    echo '<----------HFE pull complete!---------->'
fi


cd $WORKING_DIR/$REPO_NAME
npm install
cd $WORKING_DIR/$REPO_NAME/mobile
npm install

# 如果log目录不存在，新建之
mkdir -p /mnt/web/log

echo '<----------HFE upload complete!---------->'
# cd $WORKING_DIR/$REPO_NAME
# gulp

