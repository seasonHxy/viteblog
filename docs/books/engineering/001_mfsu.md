# 构建提速问题分解

::: tip
以下内容包括：构建工具，构建提速，模块联邦.
:::

## Module Federation
### 1、简述
- 模块联邦的两个方面：公开的模块和共享的模块
- 容器以异步方式公开模块
- 您需要先让容器`加载要使用的模块，然后再从容器中使用它们
- 允许构建将每个公开的模块及其依赖项放在单独的文件中
- 这样，只需要加载使用过的模块，但是容器仍然可以将模块捆绑在一起
- 另外，这里使用webpack的代码分割技术(例如，在公开的模块中分割第三方模块或公共依赖模块的代码块)
- 这使我们可以保持较低的请求和总下载量，从而获得良好的Web性能
- 容器的使用者需要能够处理暴露模块的异步加载
- 共享模块的另一个方面也显示在这里。每一个部分，容器和应用程序都可以将共享模块与版本信息一起放入共享范围
- 他们还能够使用共享范围中的共享模块以及版本要求检查
- 共享范围将对共享模块进行重复数据删除，该方式可为各方提供版本要求内的共享模块的最高可用版本
- 还以异步方式提供和使用共享模块。因此，提供共享模块没有下载成本。仅下载使用/消耗的共享模块

### 2、使用涉及的定义

使用模块联邦，每个部分将是一个单独的构建， 这些构建被编译为容器
容器可以被应用程序或其他容器引用
在这种关系中，容器是远程的，容器的使用者是主机
远程可以将模块公开给主机
主机可以使用此类模块,它们被称为远程模块
通过使用单独的构建，我们可以获得整个系统的良好构建性能
模块联邦其实是一个模块共享池。

### 3、模块联邦起源于webpack 5 

多个独立的构建可以组成一个应用程序，这些独立的构建之间不应该存在依赖关系，因此可以单独开发和部署它们。
这通常被称作微前端，但并不仅限于此。

目标：
1、每个页面单独构建
2、将组件库作为容器
3、动态远程容器

### 4、模块联邦的具体配置

 - 1、host

```js

let path = require("path");
let webpack = require("webpack");
let HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        publicPath: "http://localhost:8000/",
    },
    devServer: {
        port: 8000
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-react"]
                    },
                },
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new ModuleFederationPlugin({
            filename: "remoteEntry.js",
            name: "host",
            remotes: {
                remote: "remote@http://localhost:3000/remoteEntry.js"
            }
        })
    ]
}
```

 - 2、remote

```js

let path = require("path");
let webpack = require("webpack");
let HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        publicPath: "http://localhost:3000/",
    },
    devServer: {
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-react"]
                    },
                },
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        }),
        new ModuleFederationPlugin({
            filename: "remoteEntry.js",
            name: "remote",
            exposes: {
                "./NewsList": "./src/NewsList",
            }
          })
    ]
}

  ```
 - 3、shared
  - host 
  ```js
  plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new ModuleFederationPlugin({
            filename: "remoteEntry.js",
            name: "host",
            remotes: {
                remote: "remote@http://localhost:3000/remoteEntry.js"
            },
+           shared:{
+                react: { singleton: true },
+                "react-dom": { singleton: true }
+           }
        })
    ]
  ```

  - remote
```js
  plugins: [
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        }),
        new ModuleFederationPlugin({
            filename: "remoteEntry.js",
            name: "remote",
            exposes: {
                "./NewsList": "./src/NewsList",
            },
+            shared:{
+                react: { singleton: true },
+                "react-dom": { singleton: true }
+              }
          })
    ]
```

 - 4、双向依赖
 - Module Federation 的共享可以是双向的
 - 1、remote
 ```js

   plugins: [
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        }),
        new ModuleFederationPlugin({
            filename: "remoteEntry.js",
            name: "remote",
+            remotes: {
+                host: "host@http://localhost:8000/remoteEntry.js"
+            },
            exposes: {
                "./NewsList": "./src/NewsList",
            },
            shared:{
                react: { singleton: true },
                "react-dom": { singleton: true }
              }
          })
    ]


 ```
  - 2、host
 ```js

    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new ModuleFederationPlugin({
            filename: "remoteEntry.js",
            name: "host",
            remotes: {
                remote: "remote@http://localhost:3000/remoteEntry.js"
            },
+           exposes: {
+                "./Slides": "./src/Slides",
+           },
            shared:{
                react: { singleton: true },
                "react-dom": { singleton: true }
              }
        })
    ]


 ```



<!-- ![An image](/build_tools/building_mfsu.png) -->