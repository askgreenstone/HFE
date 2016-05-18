#!/bin/bash
# 重启测试服务器
# 定义变量
WORKING_DIR="/mnt/apps/cas/"
cd $WORKING_DIR
# 杀进程
./stop
if [ $? -eq 0 ];then
	echo -e "\033[31m 测试服务器已经停止! \033[0m"
else 
	echo -e "\033[41;37m Stop test server go wrong! \033[0m"
fi
# 重启
./start
if [ $? -eq 0 ];then
	echo -e "\033[32m 开始重启测试服务器! \033[0m"
else 
	echo -e "\033[41;37m Restart test server go wrong! \033[0m"
fi

# 倒计时5s
echo -e "\033[44;37m 5秒后自动退出当前任务！！！ \033[0m"
for i in `seq -w 5 -1 1`
  do
    echo -ne "\b\033[33m $i \033[0m""\033[33m秒～\033[0m\n";
    sleep 1;
  done
echo -e "\b\033[36m 测试服务器重启完毕，即刻退出，Bye-bye!!! \033[0m\n"

# 关闭窗口
kill -1 `ps -o ppid -p $$ | tail -1`


