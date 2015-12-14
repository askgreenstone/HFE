# HFE
Hulk Frontend Engineer

##关键词语
> web
- angularjs, requires, dynamically loading controllers and views, best practice  

> mobile
- react, flux, react-router, webpack  

> coop  

> common

##项目组成
HFE项目主要由web,mobile,coop以及common构成
- web
	- web站点：包含门户，网页版等
- mobile 
	- 移动站点：包含微信，H5页面等
- coop 
	- 合作站点：包含活动，合作，宣传
- common 
	- 通用站点：存放各站点间共用页面，或共用功能


##技术方案
> web
- 基于angularjs；
- angular-route处理路由；
- require处理模块依赖；
- 异步加载controller和view；
- 使用routeResolver和vm；
- 整体依照业务逻辑划分，局部按照功能划分；  

> mobile
- react flux react-router webpack
- 使用flux框架和webpack打包工具创建的一个简单react示例
- 参考了flux官方todomvc例子
- 添加了路由控制，使用react-router
- 拆分了common公用库和layout布局库
- 尝试添加less文件
- 添加了loader公共模块
	
		
##项目流程
<p align="center">
  <a href="http://www.askgreenstone.com/">
    <img height="385" width="560" src="http://transfer.green-stone.cn/webDeploymentFlow.jpg">
  </a>
</p>

##项目部署
> 默认当前指向HFE项目
第一步，进入HFE目录下mobile文件夹，执行webpack命令，打包生成实际文件app.js
```sh
cd mobile
webpack
```  
第二步，返回HFE目录，将dev分支提交远程库，并与master合并
```sh
cd ../
git add *  
git commit -a -m 'update HFE'  
git push origin dev    
git checkout master
git merge dev
git push origin master
``` 
第三步，运行shell脚本，在服务器端执行clone或者pull
```sh
./t-client.sh
```
##补充说明
快速连接测试服务器
```sh
ssh root@123.57.73.81 
```   
ftp删除太慢，可以执行如下代码
```sh
rm -rf dist
``` 
shell查看文件
```sh
#查看文件
cat REANDME.md
#查看文件，每显示一屏后暂停，回车继续
more package.json
#显示前10行
head README.md
#显示后10行
tail README.md
#计算文件的行数、字数或字符数
wc README.md
#页查看工具，相对于pg提供了更多高级功能，如可以用上下键滚行，PageUp和PageDown翻页等
less app.js
``` 

##注意事项
> 
1.操作前要洗手；  
2.注意操作姿势；  
3.选择正确时机；  






