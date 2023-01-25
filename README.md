# README

## 编译工具

[Bazel](https://bazel.build/)

项目根目录可运行文件`bazelisk-4.2.0`用于运行bazel，初次编译运行可能需要`g++`等组件，可根据报错提示安装。
部分构建使用了Python3，可能需将python3目录链接至`/usr/bin/python3`

## 前端入口

```bash
# 本地前端服务
./bazelisk-4.2.0 run src/app:devserver

# 打包完毕的前端静态网页文件
./bazelisk-4.2.0 build src/app:prodapp_tar
```

## 后端入口

```bash
# 后台主程序
./bazelisk-4.2.0 run src/server:main

# 后台nodejs rpc程序，用于执行文档占位符解析，模板渲染等工作
./bazelisk-4.2.0 run src/server/node:grpc_main
```

## 容器镜像

前端：
`./bazelisk-4.2.0 build docker/app:web.tar`

Golang后台：
`./bazelisk-4.2.0 build docker/app:be-server.tar`

Nodejs 后台:
`./bazelisk-4.2.0 build docker/app:node-grpc-server.tar`

## Golang 后台参数

```bash
# 后台监听地址
server.gateway_addr:	0.0.0.0:10000
# golang grpc地址（不重要）
server.grpc_addr:	localhost:10001
# nodejs gprc server地址
server.node_grpc_addr:	localhost:10002

# 日志相关 src/server/lib/log.go
syslog.level:		info
syslog.filepath:	/file.log
syslog.stdout:		
testonly:		false
# wps 参数
wps.appkey:		
wps.appid:		
wps.dbg_user: # 忽略		
wps.server.url:		https://wps-server.com
# 
jianda.server.url:	
```

## Golang Bazel

如果修改了go.mod，需运行：

`./bazelisk-4.2.0 run :gazelle_update_repos`，[gazelle](https://github.com/bazelbuild/bazel-gazelle)自动根据go.mod生成适用于bazel 的golang依赖，详见`//BUILD`，`//WORKSPACE`；

golang proxy:

``` bash
export GO111MODULE=on
export GOPROXY=https://goproxy.cn
```

## yarn

`
yarn config set registry https://registry.npm.taobao.org/
`

如果修改了 package.json，需运行：

`yarn`，`//WORKSPACE`文件里有写bazel是如何使用package.json的；
