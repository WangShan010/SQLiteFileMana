# SQLiteFileMana

管理硬盘海量零碎文件的一个 Windows 客户端软件。 使用SQLite 的 BLOB 类型 存储 图片、文档、音乐等文件。



| 信息     | 描述                                             |
| -------- | ------------------------------------------------ |
| 国内镜像 | https://gitee.com/WangShan010/SQLiteFileMana.git |
| GitHub   | 暂无                                             |
| 最新版本 | V1.5	2022年03月29日                           |
| 交流群   | QQ交流群：199800258                              |
| 作者     | WangShan010（QQ：2394837320）                    |



## 一、🚀愿景

> 前言：我是GIS行业的一名普通程序员，喜欢追逐新鲜的技术，渴望做一些好玩、有用的东西。这项目是我程序员生涯中开源的第一个作品，虽然技术能力有限，但很高兴有这么多人能 Start 我的项目，非常欢迎有小伙伴能与我一起构建这个项目。



NodeJS 技术体系中的【PKG】和【Electron】是两个令人激动的工具，他们使 JavaScript 能运行在多平台的系统上，甚至构建出：



- 在 Windows 系统上，能直接访问磁盘的 win 窗体程序
  - 可以管理海里零碎的离线【瓦片】、【地形】、【3DTiles】文件



- 在 Android 系统上可运行的 arm 程序包
  - 可以在手机、平板上【搭建离线网站】
  - 可以在手机、平板上运行任何后台程序（包括爬虫）



由此，我想借助这些开发工具，做出一个程序。让它一个能运行在任何平台上（Windows、MacOS、Linux、Android），并具备：【文件管理】、【网站发布】的能力。





## 一、简介
管理 硬盘海量零碎文件的一个 Windows 客户端软件。

- 扫描本地文件夹，导入数以百万的文件数据，统一进行压缩并存储在一个 **SQLite** 数据库文件中，迁移（备份）数据时能极大提升文件复制速度。
- 支持将 **SQLite** 中的文件数据发布成 web 服务，为文件的分发提供便利。
- 提供友好的操作界面，使用纯 HTML ，高仿 window 10 的资源管理器 。



软件界面：


![主界面](WinUI/doc/界面效果录屏.gif)



## 二、🎉技术架构

### 1. 前端计算

| 技术      | 名称                            | 官网                                                         |
| --------- | ------------------------------- | ------------------------------------------------------------ |
| Vue.js    | MVVM框架                        | [https://vuejs.org](https://gitee.com/link?target=https%3A%2F%2Fvuejs.org) |
| Element   | 基于Vue的UI框架                 | [https://element.eleme.io](https://gitee.com/link?target=https%3A%2F%2Felement.eleme.io) |
| BootStrap | HTML、CSS 和 JavaScript的UI框架 | https://v3.bootcss.com/                                      |

### 2. 后端技术

| 技术     | 名称                   | 官网                        |
| -------- | ---------------------- | --------------------------- |
| Electron | 构建桌面端程序         | https://www.electronjs.org/ |
| NodeJs   | NodeJS V14.18+         | http://nodejs.cn/           |
| Koa2     | web 后台开发框架       | https://koa.bootcss.com/    |
| SQLite   | 是一款轻型的本地数据库 | http://www.sqlite.org/      |

### 3. 开发工具

| 技术       | 名称         | 官网 |
| ---------- | ------------ | ---- |
| WebStorm | 代码编辑器   |      |
| Git        | 版本管理工具 |      |





## 三、&#x1F4C2;目录结构

```
SQLiteFileMana                         -- 根目录
│  ├─doc                 			-- 说明文档
│  ├─icon                     		-- 图标
│  ├─src                     		-- 程序代码
│  ├─static                     	-- 说明文件
│  │  ├─test                   		-- 测试代码
│  ├─web                     		-- Vue 前端代码
```





## 四、&#x1F463;开发指南



```

// 配置 cnpm
npm install -g cnpm --registry=https://registry.npm.taobao.org


// 安装 electron
cnpm install --save electron

// 启动服务
npm run dev

// 安装打包程序
cnpm install --save @electron-forge/cli
npx electron-forge import
```





## 五、&#x2753; 应用场景



### 1. GIS 数据托管

	在 Cesium 开发开发过程中，地理资源大都以切片的方式显示地图：
		
	（1）影像地图：预生成一定规格的地图切片【.png】缓存在服务器,用于响应客户端的地图请求。
	（2）地形数据：将原始【.tif】地形数据，加工为【.terrain】文件
	（3）3Dtile：三维场景中模型的 LOD 格式
		
		软件系统开发完成后，都面临着一个残酷的现实：将这些数以百万的零散地理数据文件向服务迁移、备份是一件很痛苦的一件事。



```js
    例如迁移一份 2.5GB 的全球【.terrain】地形数据，零散文件共计 2,800,297 个文件，平均每个文件 8kb 大小。
    // 硬件环境：金士顿 M.2 SSD，最大传输速度：1.2GB/s
```

![容量](./doc/容量.png)



```
如果需要迁移数据或者备份，则需要大约 65 分钟。即便使用 WinRAR 软件压缩后再迁移，压缩也最快至少需要 38 分钟，移动压缩包之后仍需解压。
```

![速度](./doc/速度.png)







## 六、🤝 鸣谢

- 望山 代码贡献者，主要作者

  









> 如果您觉得还不错请在右上角点一下 star，帮忙转发，谢谢 🙏🙏🙏 大家的支持是开源最大动力
