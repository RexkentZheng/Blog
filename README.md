# Blog
## 启动方法
### 下载项目到本地
```
git clone https://github.com/RexkentZheng/Blog.git
```
### 启动本地mongo
#### Mac
http://www.runoob.com/mongodb/mongodb-osx-install.html
#### Windows
http://www.imooc.com/article/18438

### 导入数据库文件
数据库文件在mongo里面，这里推荐使用Studio 3T
https://studio3t.com/
安装之后新建Database，名为blog
之后再数据库中导入数据库文件
### 安装依赖兵并启动项目
```
cd blog/front && npm i && npm start
```
```
cd blog/server && npm i && node /bin/blog
```
### PS
数据库的查看推荐使用Robo 3T,这个工具比较小，查看也很方便
