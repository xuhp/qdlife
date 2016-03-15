#第10章 指令详解

##10.1指令定义

对于指令，可以简单的理解成在特定DOM元素上运行的函数，指令可以扩展这个元素的功能。

directive()这个方法可以用来定义指令。

    angualr.module('myApp', [])
    .directive('myDirecitve', function ($timeout, UserDefinedService) {
        // 指令放在这里
    })
    
directive()方法可以接受两个参数：

**1. name(字符串)**

指令的名字，用来在视图中引用特定的指令。

**2. factory_function(函数)**

这个函数返回一个对象，其中定义了指令的全部行为。$compile服务利用这个方法返回的对象，在DOM调用指令时来构造指令的行为。

    angular.application('myApp', [])
    .directive('myDirective', function() {
        // 一个指令定义对象
        return {
            // 通过设置项来定义指令，在这里进行覆写
        }
    })
    
我们也可以返回一个函数代替对象来定义指令，但是像上面的例子一样，通过对象来定义是最佳方法。当返回一个函数时，这个函数通常被称作链接传递（postLink）函数，利用它我们就能定义指令的链接功能。

当AngularJS启动应用时，它会把第一个参数当作一个字符串，并以此字符串为名字来注册第二个参数返回的对象。AngularJS编译器会解析主HTML的DOM中的元素、属性、注释和CSS类名中使用了这个名字的地方，并在这些地方引用对应的指令。当它找到某个已知的指令时，就会在页面中插入指令所对应的DOM元素。

指令的工厂函数只会在编译器第一次匹配到这个指令时调用一次。和controller函数类似，我们通过$injector.invoke来调用指令的工厂函数。

指令的声明周期开始于$compile方法并结束于link方法，在本章后面的内容中我们会详细介绍这个过程。

###10.1.1 restrict（字符串）

restrict是一个可选的参数。它告诉AngularJS这个指令在DOM中可以何种形式被声明。默认值为A，即以属性的形式来进行声明。

可选值如下：

**E(元素)**

    <my-directive></my-directive>
    
**A(属性，默认值)**

    <div my-direcive="expression"></div>
    
**C(类名)**

    <div class="my-directive: expression;"></div>
    
**M(注释)**

    <!-- direcitve:my-directive:expression; -->
    
这些选项可以单独使用，也可以混合在一起使用：

    angular.module('myDirective', function(){
        return {
            restrict: 'EA' // 输入元素或属性
        }天
    })
    
属性是用来声明指令最常用的方式，因为它能在包括老版本的IE浏览器在内的所有浏览器中正常工作。

通过元素方式创建新的指令可以将一些功能封装在元素内部。

    <my-clock></my-clock>
 
 用属性形式给一个已经存在的元素添加数据或行为。
 
    <my-clock clock-display="analog"></my-clock>
    
###10.1.2 优先级（数值型）

优先级参数可以被设置为一个数值。

如果一个元素上具有两个优先级相同的指令，声明在前面的那个会被优先调用。如果其中一个的优先级更高，则不管声明的顺序如何都会被优先调用：具有更高优先级的指令总是优先运行。

> ngRepeat是所有内置指令中优先级最高的，它总是在其他指令之前运行。

###10.1.3 terminal（布尔值）

terminal是一个布尔型参数。

这个参数用来告诉AngularJS停止运行当前元素上比本指令优先级更低的指令。

ngIf的优先级略高与ngView。

###10.1.4 template（字符串或函数）

参数（可选）：

- 一段HTML文本;
- 一个可以接受两个参数的函数，参数为tElement和tAttrs，并返回一个代表模板的字符串。

必须存在一个根DOM元素：

    template: '\
        <div> <!-- single root element -->\
            <a href="xuhp.github.io">Click me</a>\
            <h1>When using two elements , wrap then in a parent element</h1>\
        </div>\

注意每一行末尾的反斜杠，这样AngularJS才能正确解析多行字符串。


###10.1.5 templateUrl （字符串或函数）

templateUrl是可选的参数，可以是以下类型：

- 一个代表外部HTML文件路径的字符串；
- 一个可以接受两个参数的函数，参数为tElement和tAttrs，并返回一个外部HTML文件路径的字符串。

$getTrustedResourceUrl, 这样可以保护模板不会被不信任的源加载。

模板加载后，AngularJS会将它默认缓存到$templateCache服务中。在实际生产中，可以提前将模板缓存一个定义模板的JavaScript文件中，这样就不需要通过XHR加载模板了。

###10.1.6 replace(布尔型)

可选参数，默认为false。

##10.2 指令作用域

$rootScope这个特殊对象会在DOM中声明ng-app时被创建：

    <div ng-app="myApp" ng-init="someProperty = 'some data'"></div>
    
    <div ng-init="siblingProperty = 'more data'">
        Inside Div Two
        <div ng-init="aThirdProperty"></div>
    </div>

###10.2.1 scope参数（布尔型或对象）

可选。

当scope为true时，会从父作用域继承并创建一个新的作用域对象。

如果一个元素上有多个指令使用了隔离作用域，其中只有一个可以生效。只有指令模板中的根元素可以获得一个新的作用域。

内置指令ng-controller的作用，就是从父级作用域继承并创建一个新的子作用域。它会创建一个新的从父作用域继承而来的子作用域。

    <div ng-app="myApp" ng-init="someProperty = 'some data'">
        <div ng-init="siblingProperty='moredata'">
            Inside Div Two：{{ aThirdProperty }}
            <div ng-init="aThirdProperty = data for 3rd property" ng-controller="SomeController">
                Inside Div three : {{ aThirdProperty }} 
                <div ng-init="aFourthProperty">
                    Inside Div Four : {{ aThirdProperty }} 
                </div>
            </div>
        </div>
    </div>

    angular.module('App', [])
    .controller('SomeController', function($scope) {
        // 可以留空，但需要被定义
    })
    
###10.2.2 隔离作用域

隔离作用域的概念是以面向对象编程为基础的。

具有隔离作用域的指令最主要的使用场景是创建可复用的组件，组件可以在未知上下文中使用，并且可以避免污染所处的外部作用域或不经意地污染内部作用域。

创建具有隔离作用域的指令需要将scope属性设置为一个空对象{}。

    <div ng-controller="MainController">
        Outside myDirecitve: {{ myProperty }}
        <div my-directive ng-init="myProperty = 'wow, this is cool'">
            Inside myDirective: {{ myProperty }}
        </div>
    </div>

    angular.module('myApp', [])
    .controller()