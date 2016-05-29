# 下载 ![aa](bb)
使用 coolie demo 命令下载本 demo。
```
➜ coolie demo 8
```



# 资源模块

资源模块指的是图片、样式、html片段等非脚本模块（在 coolie 的世界里，一切皆是模块）。

使用方法：

```
require('style.css');
```

[coolie 支持的模块类型](/introduction/module-type.md)。


# demo
## 初始化目录结构
新建`coolie-demo8`目录：
```
coolie-demo8
└── webroot-dev

1 directory, 0 files
```

## 初始化文件
准备一张图片`coolie.png`，放在 webroot-dev 目录下。

### style.css
然后在 webroot-dev 目录下新建`style.css`：
```
body{
	background: url(coolie.png);
	color: #AF00FF;
	font-size: 60px;
}
```

### template.html
然后继续在 webroot-dev 目录下新建`template.html`：
```
<h1>Hello coolie</h1>
```


### index.js
然后在 webroot-dev 目录下新建入口模块`index.js`：
```
// 引入样式文件模块，并自动插入到 style 标签里
require('./style.css', 'css|style');

// 在文档里插入 html 片段
document.getElementById('demo').innerHTML = require('./template.html');
```


### package.json
新建 `package.json`:
```
{
  "name": "coolie-demo8-webroot",
  "version": "2.0.0"
}
```


### coolie.js
使用命令下载模块加载器：
```
➜  npm install --save coolie.js

coolie.js@2.0.8 node_modules/coolie.js
```

### coolie-config.js
再写模块加载器配置文件，使用命令生成配置文件（`coolie-config.js`）：
```
➜  coolie init -j

┌────────────────────────────────────┐
│ coolie-cli                         │
│ coolie@1.6.4                       │
│ The front-end development builder. │
└────────────────────────────────────┘

        init success >> /coolie-demo6/src/coolie-config.js
```
修改其内容为：
```
/**
 * ======================================================
 * coolie.js 配置文件 `coolie-config.js`
 * 使用 `coolie init -j` 生成 `coolie-config.js` 文件模板
 * 前端模块加载器配置文件
 *
 * @link http://coolie.ydr.me/guide/coolie-config.js/
 * @author ydr.me
 * @version 2.0.0
 * @create 2016-05-28 20:34:17
 * ======================================================
 */

coolie.config({
    // 模块模式，开发环境为 COMMONJS
    mode: 'CJS',

    // 入口模块基准路径，相对于当前文件
    mainModulesDir: '/',

    // node_modules 目录指向，相对于 mainModulesDir
    nodeModulesDir: '/node_modules/',

    // 手动指定 node 模块的入口文件，此时将不会去加载模块的 package.json
    // 除非你非常肯定，你加载的 node 模块的入口路径都是一致的
    // 否则不要修改配置此项
    // nodeModuleMainPath: 'src/index.js',

    // 是否为调试模式，构建之后会修改为 false
    debug: true,

    // 全局变量，用于模块构建的预定义变量判断压缩
    global: {}
}).use();

```

主要修改了`base`值，使入口模块基准路径指向当前文件所在的目录。


### index.html
最后写`index.html`：
```
<!doctype html>
<meta charset="utf-8">
<div id="demo"></div>

<script src="/node_modules/coolie.js/coolie.js"
        coolie
        data-config="/coolie-config.js"
        data-main="index.js"></script>
```


## 前端构建前运行
在`src`目录下，使用[sts](https://www.npmjs.com/package/sts)执行：
```
➜  sts
                 sts >> A static server is running.
                open >> http://192.168.0.156:60880
```

![](https://dn-fed.qbox.me/@/res/20160126210848618401171152 =720x346)



## 前端构建配置
使用命令生成前端构建配置文件：
```
➜  coolie init -c

┌────────────────────────────────────┐
│ coolie-cli                         │
│ coolie@1.6.4                       │
│ The front-end development builder. │
└────────────────────────────────────┘

        init success >> /coolie-demo8/src/coolie.config.js
```

修改配置文件（`coolie.config.js`）为：
```
/**
 * ======================================================
 * coolie-cli 配置文件 `coolie.config.js`
 * 使用 `coolie init -c` 生成 `coolie.config.js` 文件模板
 * 当前配置文件所在的目录为构建的根目录
 *
 * @link http://coolie.ydr.me/guide/coolie.config.js/
 * @author ydr.me
 * @version 1.6.4
 * @create 2016-01-26 20:59:40
 * =======================================================
 */

'use strict';

module.exports = function (coolie) {
    // coolie 配置
    coolie.config({
        // 是否在构建之前清空目标目录
        clean: true,

        // 目标配置
        dest: {
            // 目标目录，相对于当前文件
            dirname: '../webroot-pro/',
            // 目标根域
            host: '',
            // 版本号长度
            versionLength: 32
        },

        // js 构建
        js: {
            // 入口模块，相对于当前文件
            main: [
                // 支持 glob 语法
                //【1】
                'index.js'
            ],
            // coolie-config.js 路径，相对于当前文件
            //【2】
            'coolie-config.js': 'coolie-config.js',
            // js 文件保存目录，相对于 dest.dirname
            dest: './static/js/',
            // 分块配置
            chunk: []
        },

        // html 构建
        html: {
            // html 文件，相对于当前文件
            src: [
                // 支持 glob 语法
                //【3】
                'index.html'
            ],
            // 是否压缩
            minify: true
        },

        // css 构建
        css: {
            // css 文件保存目录，相对于 dest.dirname
            dest: './static/css/',
            // css 压缩配置
            minify: {
                compatibility: 'ie7'
            }
        },

        // 资源
        resource: {
            // 资源保存目录，相对于 dest.dirname
            dest: './static/res/',
            // 是否压缩
            minify: true
        },

        // 原样复制文件，相对于当前文件
        copy: [
            // 支持 glob 语法
            //【4】
            //'./favicon.ico',
            //'./robots.txt'
        ]
    });

    // 使用 coolie 中间件
    // coolie.use(require('coolie-*'));

    // 自定义 coolie 中间件
    //coolie.use(function (options) {
    //    // do sth.
    //    return options;
    //});
};
```

- 【1】：修改了入口模块路径为`index.js`
- 【2】：修改了模块加载器配置文件路径为`coolie-config.js`
- 【3】：修改了 html 路径为`index.html`
- 【4】：取消了复制文件路径


## 前端构建
执行前端构建：


```
➜  coolie build

┌──────────────────────────────┐
│ coolie@2.0.0                 │
│ 前端工程化构建工具           │
│ 官网：https://coolie.ydr.me/ │
└──────────────────────────────┘


            step 1/6  >>  parse coolie-cli profile
       coolie config  >>  /coolie-demo8/webroot-dev/coolie.config.js
         src dirname  >>  /coolie-demo8/webroot-dev
        dest dirname  >>  /coolie-demo8/webroot-pro/

            step 2/6  >>  copy files
          copy files  >>  no files are copied

            step 3/6  >>  build main modules
        parse module  >>  1 modules parsed
          build main  >>  will build 1 main modules
                 1/1  >>  /index.js

            step 4/6  >>  generate coolie.js profile
    coolie-config.js  >>  mainModulesDir: "/static/js/main/"
    coolie-config.js  >>  asyncModulesDir: "../async/"
    coolie-config.js  >>  chunkModulesDir: "../chunk/"
    coolie-config.js  >>  callbacks: 0
    coolie-config.js  >>  ../webroot-pro/static/js/334e1ea3301b33071eb3c5c1a510fd2d.js

            step 5/6  >>  build htmls
                 1/1  >>  /index.html

            step 6/6  >>  generate coolie map
          coolie map  >>  ../webroot-pro/coolie-map.json

       build success  >>  elapsed 585ms, at 2016-05-28 21:57:49.934
```


从构建日志上也可以看出，构建了哪些模块。



## 前端构建后运行
切换到 webroot-pro 目录，执行 [sts](https://www.npmjs.com/package/sts)执行：
```
➜  cd ../webroot-pro
➜  sts
                 sts >> A static server is running.
                open >> http://192.168.0.176:60786

```

![](https://dn-fed.qbox.me/@/res/20160126211803457240331463 =681x329)

- 主要区别是在控制台，加载时间从原来的 93ms 缩减到 16ms
- 界面上显示正常


## 分析构建结果

### coolie-map.json
首先看看构建之后的 coolie-map.json（[资源关系解读](/introduction/resource-relationship-map.md)）:
```
{
  "/index.html": {
    "main": [
      {
        "src": "../webroot-dev/index.js",
        "dest": "/static/js/main/664c0ade7b31b0bafe89a6fe8685b2e1.js",
        "deps": [
          "../webroot-dev/style.css",
          "../webroot-dev/template.html",
          "../webroot-dev/coolie.png"
        ]
      }
    ],
    "js": [
      {
        "dest": "/static/js/0996319be2c4f9517575b54dcc4af897.js",
        "deps": [
          "../webroot-dev/node_modules/coolie.js/coolie.js"
        ]
      }
    ],
    "css": [],
    "res": []
  }
}
```

### index.html
`index.html`页面引用了`index.js`模块，
并且该模块构建之后的文件名为`664c0ade7b31b0bafe89a6fe8685b2e1.js`，
该入口模块引用了`style.css`、`template.html`和`coolie.png`（图片是在 style.css 里引用的）三个模块。

我们来看下入口模块`664c0ade7b31b0bafe89a6fe8685b2e1.js`的内容：
```
/*coolie built*/
define("0",["1","2"],function(e,n,d){e("1");document.getElementById("demo").innerHTML=e("2")});
define("1",[],function(){return coolie.importStyle("body{background:url(/static/res/7d9bbb425d679ca6c75f1cbbc66785fa.png);color:#AF00FF;font-size:60px}")});
define("2",[],function(){return"<h1>Hello coolie</h1>"});
```

从上可知模块 ID 的对应关系：

```
index.js => 0
style.css => 1
template.html => 2
coolie.png => /static/res/7d9bbb425d679ca6c75f1cbbc66785fa.png
```

其中样式模块里使用了`coolie.importStyle`方法来自动加载样式。


# github
<https://github.com/cooliejs/coolie-demo8/>

