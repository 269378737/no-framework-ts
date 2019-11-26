这是一个没有 `Angular`、`Vue` 等框架但可以使用 `Webpack`、`Typescript` 来实现模快化、工程化、自动化的项目模板。

该项目主要用来编写一些静态页面网站（仅能有一些简单的数据渲染、互动），无法处理各类表单、复杂数据绑定、组件通信等复杂需求。


### 使用本模板主要用到的技术栈：

* **Webpack**

* **Typesctipt**

* **Javascript**

* **HTML(5)**

* **CSS(3)**


### 模板的目录结构说明：

```js
├───data                               // mock数据目录
├───src                                // 项目主目录
│   ├───assets                         // 静态资源目录
│   │   ├───css
│   │   └───img
│   ├───components                     // 业务组件目录
│   ├───core                           // 项目核心文件目录 - 核心父类实现、项目底层框架、数据渲染、UI渲染等
│   ├───data                           // 数据预定义目录 - 用于渲染组件的数据，某些数据可以先按照一定格式预先定义
│   ├───docs                           // 静态文件目录 - office文档、pdf、html文件等
│   ├───lib                            // 自定义插件目录
│   ├───model                          // interface 定义目录
│   ├───utils                          // Helper、Format等通用工具目录
│   ├───component.render.config.ts     // 组件渲染配置文件
│   ├───custom.d.ts                    // 模块声明文件
│   ├───index.html                     // 模板文件
│   ├───index.ts                       // 项目入口文件
├───package.json
├───README.md
├───test.html                          // 临时写小demo用
├───tsconfig.json
├───webpack.base.config.js
├───webpack.dev.config.js
└───webpack.prod.config.js
```


## 渲染流程

1、预定义全局数据 （`data` 文件夹下）

2、在 `component.render.config.ts` 中导入全局数据，并将组件需要的相关数据（包括预定义数据、后台接口数据）绑定到组件上，绑定到组件上的数据可能需要经过一些处理才能被组件所使用。

3、在 入口文件 `index.ts` 中调用渲染函数渲染组件


## FAQ

1、如果引入的第三方模块(如 `jQuery` ) `Typescript` 提示找不到该模块

```js
npm install jquery --save

// 在 custom.d.ts 中声明该模块：
declare module "jquery"
```

