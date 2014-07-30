#浏览器的javascript引擎

浏览器通过内置的javascript引擎，读取网页中的代码，对其后台进行处理。

##概述

###javascript代码嵌入方法

####（1）直接添加代码块

    <script>
    //some javascript code
    </script>

####（2）加载外部脚本
 
	<script src="example.js"></script>

如果脚本使用了非英文字符，还应该注明编码。

	<script charset="utf-8" src="example.js"></script>

加载外部脚本和直接添加代码块，这两种方法不能混用。下面的console.log语句直接被忽略。
	
	<script charset="utf-8" src="example.js">
	    console.log('Hello World!');
	</script>

####（3）行内代码

HTML语言允许在某些元素的事件属性和a元素的href属性中，直接写入javascript

	<div onclick="alert('Hello')"></div>
	
	<a href="javascript:alert('Hello')"></a>

 将HTML代码与javascript代码混写在一起，不利于代码管理。

###外部脚本的加载和阻塞效应

下载和执行外部javascript代码时，浏览器会暂停页面渲染。

如果某段代码的下载或执行时间特别长，浏览器就会呈现假死状态，失去响应。

将Script标签放在底部就可以避免这种情况。

将脚本文件放在网页底部还有一个好处。在DOM结构生成之前就调用DOM，javascript会报错，放在尾部加载就不会碰到这个问题。

	<head>
	<script>
		console.log(document.body.innerHTML); 
	</script>
	</head>

以上代码会报错。

>了解更多 [浏览器加载和渲染html的顺序](F:\qdlife\learn_note\pgg\learn_note\随手记\浏览器对象\浏览器的javascript引擎\浏览器加载和渲染html的顺序.html)

如果是多个Script标签

	<script src="1.js"></script>
	<script src="2.js"></script>

会平行下载1.js和2.js,但执行时会先执行1.js,然后执行2.js。

脚本的执行顺序由他们在页面中的出现顺序决定，这是为了保证脚本之间的依赖关系不受到破坏。

###解决脚本文件下载阻塞网页渲染问题

####加入defer属性

	<script src="1.js" defer></script>
	<script src="2.js" defer></script>

加入defer属性之后，浏览器下载脚本文件的时候，不会阻塞页面渲染。下载的脚本在DOMContentLoaded事件触发前执行（即刚刚读取完</html>标签），可以保证脚本的执行顺序。


> 1. 浏览器支持不理想，IE（<=9）,无法保证js执行顺序（2.js在1.js之后执行）。
> 2. 对内置代码，直接添加的代码块，动态生成的Script标签不起作用。

####加入async属性

	<script src="1.js" async></script>
	<script src="2.js" async></script>

anync属性可以保证脚本下载的同时，浏览器继续渲染。渲染完成后执行脚本。

> 1. 无法保证脚本执行顺序，哪个先下载结束就先执行那个。
> 2. 只支持ie10+
> 3. 同时使用defer和async,defer不起作用

####资源文件的下载

对于来自同一个域名的资源，比如脚本文件、样式表文件、图片文件等，浏览器一般最多同时下载六个。如果是来自不同域名的资源，就没有这个限制。可以把静态文件放在不同的域名之下，加快下载速度。

###动态嵌入

	var src=['1.js', '2.js'];
	for(var i=0 ; i<src.length;i++){
		var script = document.createElement('script');
	    script.src =src[i];
	    document.head.appendChild(script);
	}

>优点：动态生成的Script标签不会阻塞页面渲染，也就是不会造成浏览器假死。

>缺点：无法保证脚本的执行顺序，哪个文本先下载完成就先执行哪个。

将anync设置为false可以解决执行顺序问题问题

	var src=['1.js', '2.js'];
	for(var i=0 ; i<src.length;i++){
		var script = document.createElement('script');
	    script.src =src[i];
		script.async=false;
	    document.head.appendChild(script);
	}

当Script标签指定的外部脚本文件下载和解析完成，会触发一个load事件。可以为这个事件指定回调函数。

	<script async src="jquery.min.js" onload="console.log('jQuery已加载！')"></script>

##javascript虚拟机——javascript引擎

JavaScript是一种解释型语言，也就是说，它不需要编译，可以由解释器实时运行。

>优点：运行和修改方便，刷新页面就可以重新解释。

>缺点：每次调用都要调用解析器，体统开销大，运行速度慢于编译语言。

目前浏览器都将javascript进行了一定程度的编译，生成类似字节码（bytecode）的中间代码，以提高运行速度。

###什么是javascript引擎

javascript引擎就是能够“读懂”javascript代码，并给出代码运行结果的一段程序。比如你写了var a=1+1; javascript引擎做的事情就是看懂（解析）这段代码，并且将a的值变为2。

对于静态语言（如java、c++、c）来说,处理上述事情的叫做**编译器（compiler）**。对于javascript这样的动态语言则叫做**解释器（interpret）**。**编译器是将源代码编译为另一种代码（比如机器码，或者字节码），而解析器是直接解析并将代码运行结果输出。**

现在javascript引擎已经很难界定算是解析器还是编译器了。

>静态（类型）语言：在运行前编译时检查类型。在写代码时，每声明一个变量必须指定类型。

>动态（类型）语言：在运行期间检查数据类型的语言。用这类语言编程，不会给变量指定类型，而是在赋值时得到数据类型。

###javascript引擎和ECMAScript是什么关系？

javascript引擎是一段程序，我们写的javascript代码也是程序，如何让程序去读懂程序呢？这就需要定义规则。ECMAScript 262 就定义了一套完整的标准。`标准`的javascript引擎就会根据这套文档去实现。

ECMAScript定义了语言的标准，javascript引擎根据它来实现。

###javascript引擎与浏览器又有什么关系

javascript引擎是浏览器的组成部分之一。浏览器还要做很多别的事情，比如解析页面、渲染页面、cookie管理、历史记录等等。

不同的浏览器采用不同的javascript引擎。

###JIT

早期浏览器内部对javascript的处理过程

1. 读取代码，进行词法分析（Lexical analysis），将代码分解成词元（token）。
2. 对词元进行语法分析（parsing），将代码整理成“语法树”（syntax tree）。
3. 使用“翻译器”（translator），将代码转为字节码（bytecode）。
4. 使用“字节码解释器”（bytecode interpreter），将字节码转为机器码。

逐行解释将字节码转为机器码，是很低效的。

即时编译（Just In Time compiler）:字节码只在运行时编译，用到哪一行就编译到哪一行，并且把编译结果缓存（inline cache）。通常，一个程序被经常用到的，只是其中一小部分代码，有了缓存的编译结果，整个程序的运行速度就会显著提升。

不同的浏览器有不同的编译策略。有的浏览器只编译最经常用到的部分，比如循环的部分；有的浏览器索性省略了字节码的翻译步骤，直接编译成机器码，比如chrome浏览器的V8引擎。

最常见的javascript引擎

- Chakra(Microsoft Internet Explorer)
- Nitro/JavaScript Core (Safari)
- Carakan (Opera)
- SpiderMonkey (Firefox)
- V8 (Chrome, Chromium)

##单线程模型

###Event Loop

Javascript采用单线程模型，也就是说，所有任务都在一个线程里运行。这意味着一次只能运行一个任务，其他任务都必须在后面排队等待。

> 问题：新的任务被添加在队列的尾部，只有所有的任务运行结束，才会轮到它执行。如果有一个任务特别耗时，后面的任务都会停在那里等待，造成浏览器失去响应，又称作“假死”。

为了解决这个问题，javascript采用了**Event Loop**机制。

运行以后的程序叫做“进程”（process）,一般情况下，一个进程一次只能执行一个任务。如果有很多任务需要执行，解决方案一共有以下三种。

**1. 排队。**一个进程一次只能执行一个任务，只好等待前面的任务执行完毕，再执行后面的任务。
**2. 新建进程。**使用fork命令，为每个任务新建一个进程
**3. 新建线程。**因为进程太耗资源，所以如今的程序往往允许一个进程包含多个线程，由线程去完成任务。

如果某个任务很耗时，比如涉及很多I/O操作，那么线程大概如下

![](http://i.imgur.com/y1Mu8MB.png)

上图的绿色部分是程序的运行时间，红色部分是等待时间。由于I/O操作很慢，所以大部分运行时间都在空等I/O操作返回结果。这就是**“同步模式”**（synchronous I/O）。

如果采用多线程，同时运行多个任务，很可能像下面这样。

![](http://i.imgur.com/xuOviuA.png)

多线程不仅占用多倍的系统资源，也闲置了多倍的资源。

**Event Loop**就是为了解决这个问题而提出的。

Event Loop 是一个程序结构，用于等待和发送消息事件。

简单说，就是在程序中设置两个线程：一个负责本身程序的运行，称为“主线程”；另一个负责主线程与其他进程（主要是各种I/O操作）的通信，被称为“Event Loop线程”（消息线程）。

![](http://i.imgur.com/oPT47LN.png)

绿色部分表示运行时间，橙色部分表示空闲时间。每当遇到I/O时，主线程就让Event Loop线程去通知I/O程序，然后接着往后运行，所以不存在红色的等待时间。等到I/O程序完成操作，Event Loop线程再把结果返回主线程。主线程就调用事先设定的回调函数，完成整个任务。

这种方式被称为“**异步模式**”（asynchronous I/O）。

这正是javascript语言的运行方式。单线程模型虽然对JavaScript构成了很大的限制，但也因此使它具备了其他语言不具备的优势。如果部署得好，JavaScript程序是不会出现堵塞的，这就是为什么node.js平台可以用很少的资源，应付大流量访问的原因。


> 更多相关
> 
>1.  [socket阻塞与非阻塞，同步与异步](http://blog.csdn.net/hguisu/article/details/7453390)
> 2. [Node.js异步式I/O与事件式编程](F:\qdlife\learn_note\pgg\learn_note\随手记\浏览器对象\浏览器的javascript引擎\node.js快速入门.jpg)

###setTimeout方法

