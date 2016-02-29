#第9章 内置指令

AngularJS 提供了一系列内置指令。其中一些重载了原生的HTML元素，比如 form a 。其他内置指令通常以ng为前缀。某些内置指令并不会有对应的HTML标签，比如ng-controller。

所有以ng前缀开头作为命名空间的指令都是AngularJS提供的内置指令，因此不要把自己开发的指令以这个前缀命名。

##9.1 基础 ng 属性指令

和原生HTML标签名称相似的一组内置指令：

- ng-href
- ng-src
- ng-disabled
- ng-checked
- ng-readonly
- ng-selected
- ng-class
- ng-style

###9.1.1 布尔属性

根据HTML标准的定义，布尔属性代表一个true或false值。当这个属性出现时，这个属性的值就是true(无论实际定义的值是什么）。如果未出现，这个属性的值就是false 。

**1. ng-disabled**

使用ng-disabled可以把disabled属性绑定到以下表单输入字段上：

- input (text、checkbox、radio、number、url、email、submit)
- textarea
- select
- button

通过ng-disabled可以对是否出现属性进行绑定。例如，在下面的例子中按钮会一直禁用，直到用户在文本字段中输入内容：

    <input type="text" ng-model="someProperty" placeholder="typeToEnabled">
    <button ng-model="button" ng-disabled="!someProperty">AButton</button>

下面的例子，文本字段会被禁用5秒，知道$timeout中将isDisabled属性设置为false：

    <textarea ng-disabled="isDisabled">Wait5seconds</textarea>
    angular.module('myApp', [])
    .run(function($rootScope, $timeout) {
        $rootScope.isDisabled = true;
        $timeout(function() {
            $rootScope.isDisabled = false;
        }, 5000)    
    })
    
**2. ng-readonly**

    Type here to make sibling readonly:
    <input type="text" ng-model="someProperty" />
    <input type="text" ng-readonly="someProperty" value="Some text here" />    
    
**3. ng-checked**

    <label>someProperty = {{someProperty}}</label>
    <input type="checkbox" ng-checked="someProperty" ng-init="someProperty = true" ng-model="someProperty" />
    
**4. ng-selected**

    <label>Select Two Fish:</label>
    <input type="checkbox" ng-model="isTwoFish" /> <br />
    <select>
        <option>One Fish</option>
        <option ng-selected="isTwoFish">Two Fish</option>
    </select> 
    
###9.1.2 类布尔属性

ng-href、ng-src等属性虽然不是标准的HTML布尔属性，但是由于行为相似，所以在AngularJS源码内部是和布尔属性同等对待的。

**1. ng-href **

当使用当前作用域中的属性动态创建URL时，应该用ng-href代替href。

这里的潜在问题是当用户点击一个由插值动态生成的链接时，如果插值尚未生效，将会跳转到错误页面（通常是404）。

如果使用ng-href，AngularJS会等到插值生效后再执行点击链接的行为：

    <!-- 当 href 包含一个 {{expression}} 时总是使用 ng-href -->
    <a href="{{ myHref }}">I'm feeling lucky, when I load</a>
    
    <a href="{{ myHref }}">I'm feeling 404</a>
    
将插值生效的事件延迟5秒，来观察实际的行为：

    angular.module('myApp', [])
    .run(function($rootScope, $timeout) {
        $timeout(function(){
            $rootScope.myHref = 'www.baidu.com';
        }, 5000)
    })


> 实测之后两者表现一致，如果插值未生效会刷新本页面。angularJS: v1.2.29, chrome: 48.0.2564.116

**2. ng-src**

AngularJS 会告诉浏览器在ng-src对应的表达式生效之前不要加载图像：

> 实测同ng-href

##9.2 在指令中使用子作用域

下面将要介绍的指令会以父级作用域为原型生成子作用域。这种继承的机制可以创建一个隔离层，用来将需要协同工作的方法和数据模型放置在一起。

ng-app 为 AngularJS应用创建$rootScope， ng-controller 则会以$rootScope或另外一个ng-controller的作用域为原型创建新的子作用域。

**1. ng-app**

任何具有ng-app属性的DOM元素将被标记为$rootScope的起始点。

$rootScope是作用域链的起始点，任何嵌套在ng-app内的指令都会继承它。

在JavaScript代码中通过run方法来访问$rootScope。

    <html ng-app="myApp">
        <body>
            {{ someProperty }}\
            <button ng-click="someAction()"></button>
        </body>
        
        angular.module('myApp', [])
        .run(function(){
            $rootScope.someProperty = 
        })
    </html>