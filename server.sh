#!/bin/bash
echo '<----------HFE is ready to build!---------->'

set -e
# 更新系统级环境变量，NODE_ENV写在里面
source /etc/environment

# 定义变量
WORKING_DIR="/mnt/web/"
REPO_NAME="HFE"


cd $WORKING_DIR

# 1.从版本库获取文件
if [[ ! -d $REPO_NAME ]]; then
		echo '<----------begin to clone HFE.git!---------->'
    git clone -b master https://askgreenstone:lskj2014@github.com/askgreenstone/HFE.git
    echo '<----------Progress 30% , HFE clone task complete!---------->'
else
    cd $WORKING_DIR/$REPO_NAME
    echo '<----------begin to pull HFE.git!---------->'
    git pull origin master
    echo '<----------Progress 30% , HFE pull task complete!---------->'
fi

# 2.添加包依赖
echo '<----------begin to install package!---------->'
cd $WORKING_DIR/$REPO_NAME
npm install
cd $WORKING_DIR/$REPO_NAME/mobile
npm install
echo '<----------Progress 40% , install package task complete!---------->'

# 3.如果dist目录不存在，新建之；如果存在，清空目录
echo '<----------begin to create dist folder!---------->'
cd $WORKING_DIR
if [ ! -d dist ]; then
   mkdir dist
else
	cd $WORKING_DIR/dist
	for f in `ls`
	do
	  if [  -d $f  ]
	  then  
	    rm -rf $f
	  else
	    rm  $f
	  fi  
	done
fi
echo '<----------Progress 60% , create dist folder task complete!---------->'

# 4.拷贝HFE目录到dist
echo '<----------begin to copy HFE to dist!---------->'
cd $WORKING_DIR/$REPO_NAME
for f in `ls`
do                     
  if [  -d $f  ]
  then  
    cp -rf $f $WORKING_DIR/dist #拷贝文件夹
  else
    cp $f $WORKING_DIR/dist #拷贝文件
  fi                  
done 
echo '<----------Progress 80% , copy HFE task complete!---------->'        

# 5.执行gulp
echo '<----------begin to run gulp!---------->'
cd $WORKING_DIR/dist
gulp
echo '<----------Progress 90% , gulp task complete!---------->'   

# 如果log目录不存在，新建之
mkdir -p /mnt/web/log

# 启动node服务器
echo '<----------begin to run node!---------->'
cd $WORKING_DIR/dist/mobile
pm2 start pm2.json 
# node server.js 
echo '<----------Progress 95% , node server start!---------->' 

echo '<----------Progress 100% , HFE build successfully!---------->'











