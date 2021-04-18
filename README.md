# interview

> 该项目是面试系统，前端为 React + Antd ，服务端采用 Koa2。注意 Node 版本为 7+ 

### 一、使用指南

 #### 1、后端启动
  ```
  cd ~
  mkdir workspace && cd workspace
  git clone https://github.com/568815707/interview
  cd interview
  npm i
  npm run dev
  ```  

 #### 2、前端启动
```
 cd app
 npm i
 npm run dev
```

### 二、项目架构

```
|—- app             // 前端目录
  |-- config        // 前端 webpack 配置
  |-- dist          // 打包之后的静态文件存放
  |-- src 
    |-- components  // 公共组件
    |-- containers  // 页面
      |-- audit     // 审核页面
      ······
|-- config          // 后端配置
|-- libs            // 数据库使用的封装+工具集
|-- pm2             // 运行配置
|-- server          
    |-- routers     // 路由文件
        |-- xxx.js 

```

### 三、开发流程

#### 前端开发流程

- 如何新增一个模块

  1、在 `app/src/containers/` 新建 xxx 文件，然后在 xxx 文件中新建 `index.js`
  2、在 `app/src/containers/App.js` 中引入即可

#### 后端开发流程

  1、在 `server` 下 `routers` 中创建一个 `xxx.js` 文件（脚本里面写的都是 `router`）。
  2、在 `index.js` 文件中引用你刚刚创建的 `js` 文件， 然后 `use` 一下就行了。详细的可以看在 `index.js` 文件中是如何抛出路由的。

### 四、部署方法

- 在 App 目录下先进行 `npm run build` 打包。
- 在根目录执行 `npm run deploy` 进行上线，`npm run deploy`是进行提测

### 五、返回码

- 200 成功

- 400001 账户或者密码错误

- 400002 参数不合法

### 六、关于作者

- osenki

### 七、授权协议

MIT
