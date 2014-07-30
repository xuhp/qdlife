#ct-ui使用说明
 
 本ui库是基于支付宝的Alice（样式解决方案），产出的样式库。

> 注： Alice是一套基于 `CMD` 生态圈的样式模块集合，是一套模块化的样式命名和组织规范。她包括一套通用的样式模块库，一个模块化样式构建规范，一组帮助书写和组织样式的工具，以及产出更多Alice模块和样式库的完善方案。

 如果您想了解更多关于Alice的内容，请访问Alice官网 [http://aliceui.org/](http://aliceui.org/)

##前期准备

### 安装Node.js

 到Node.js 官网下载，一键安装
 
 默认会集成npm包管理工具，但是由于天朝的特殊国情，npm经常无法正常工作。推荐使用淘宝的cnpm [http://cnpmjs.org/](http://cnpmjs.org/)

 npm 的环境变量配置

    PATH = c:\Users\{{username}}\AppData\Roaming\npm
    NODE_PATH = c:\Users\{{username}}\AppData\Roaming\npm\node_modules

>注:启动spm时总是报 Please set environment variable NODE_PATH 原因有两种

>1. C:\大小写问题 [点击查看](https://github.com/spmjs/spm/issues/706)
>2. 版本问题，重新安装Node.js即可

### 安装git
 
>只讲解git在window下的配置

1. 从git官网下载windows版本的git: [http://git-scm.com/downloads](http://git-scm.com/downloads)
2. 一般使用默认设置即可：一路next,git安装完毕！
3. 但是如果这个时候打开windows的cmd,在里面打开git命令会提示“不是内部或外部命令，也不是可运行程序”，想要直接在windows的cmd里使用git命令要多加两步
4. 找到git安装路径中bin的位置，如：C:\Program Files\Git\bin.  找到git安装路径中git-core的位置，如：C:\Program Files\Git\libexec\git-core
5. 右键“计算机” -> “属性” -> "高级系统设置" -> “环境变量” -> 在用户变量中找到"path" -> 选中"PATH"并选择“编辑” -> 将4中找到的bin和git-core路径复制到其中 -> 保存并退出

> 注： “C:\Program Files\Git\bin”是安装路径，可能与你的安装路径不一样，要按照自己的路径替换“C:\Program Files\Git\bin”

> 注： “PATH”中，每个路径之间要以英文输入状态下的分号——“;”作为间隔

> 注： 环境变量分为系统环境变量和用户环境变量。系统环境变量，对所有用户起作用。用户环境变量只对当前用户起作用。

####git相关知识

 git-简易指南 [http://www.bootcss.com/p/git-guide/](http://www.bootcss.com/p/git-guide/)
 
 Git使用基础 [http://www.open-open.com/lib/view/open1332904495999.html](http://www.open-open.com/lib/view/open1332904495999.html)

 Git Push 避免使用用户名和密码方法 [http://www.cnblogs.com/ballwql/p/3462104.html](http://www.cnblogs.com/ballwql/p/3462104.html)

###安装和配置spm

####安装spm

    npm install spm -g

####安装spm-build

spm-build为构建工具

    npm install spm-build -g

####安装spm-init

spm-init为初始化模版工具

    npm install spm-init -g

####安装spm-doc

spm-doc是封装了静态文档生成工具[nico](https://github.com/lepture/nico)的一个用于模版文档生成调试的工具

    npm install spm-doc -g

##开发一个样式模块

 我们页面中总是存在各式各样的模块化的DOM结构，都可以依据其复用度来吧其中一部分代码提炼成样式模块

###初始化模块

 开发一个box区块模块。首先建立一个文件夹，并使用 `spm init` 命令进行初始化
 
    $ mkdir box
    $ cd box
    $ spm init

这时程序会让你输入相关的信息，填写family为ct-ui或其他，name为box后，就会生成一个ct-ui模块的初始化目录结构

    src/
    README.md
    HISTORY.md
    package.json

其中 `src` 目录存放我们的样式源文件， `HISTORY.md`用于版本的升级记录，`README.md` 是用来写文档和DEMO的地方，`package.json` 存放模块的基本信息。我们可以在 `package.json` 中的spm字段中的ct-ui填写所需的依赖的别名。

###写文档和设计html结构

