# HFE
Hulk Frontend Engineer

##关键词语
> web
- angularjs, requires, dynamically loading controllers and views, best practice
> mobile
- react, flux, react-router, webpack
> coop
> common

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
	
		
##开发部署
```sh
- git add README.md  
- git commit -a -m 'update readme'  
- git push origin dev  
- test_service.sh 
``` 

##注意事项
> 
1.操作前要洗手；  
2.注意操作姿势；  
3.选择正确时机；  






