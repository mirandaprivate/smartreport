# 说明

## 关于 webpack 构建

在 `src/web` 目录下的 package.json 文件目前主要用于使用 webpack devserver 进行开发体验

### 运行 webpack devserver

```bash
cd src/web
yarn install
yarn run serve
```

### 目前webpack构建中的问题

1. 组件component.ts中引用样式文件已经全部改为了直接使用scss文件, 若使用css文件的话在webpack构建时会报错找不到css文件(需要依赖bazel将scss先转为css，并在bazel输出目录中寻找css文件，这个过程比较繁琐, 因此直接将所有的地方都改为了直接引用scss)

2. 针对 @logi-icon 的引用(类似的还有@logi-assets，@logi-pb)，由于目前这些包名都是依赖bazel才有的，因此需要实现使用 bazel build 生成这些包，然后 `webpack.tsconfig.json` 中会配置对应的映射路径
