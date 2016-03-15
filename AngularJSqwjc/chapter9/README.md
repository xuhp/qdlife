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
            $rootScope.someProperty = 'hello computer';
            $rootScope.someAction = function(){
                $rootScope.someProperty = 'hello human';    
            }
        })
    </html>
    
**2. ng-controller**

ng-controller的作用是为嵌套在其中的指令创建一个子作用域，避免将所有操作和模型都定义在$rootScope上。

子$scope只是一个Javascript对象，其中含有从父级$scope中通过原型继承得到的方法和属性，包括应用的$rootscope.

嵌套在ng-controller中的指令有访问新子$scope的权限，但是要牢记每个指令都应该遵守的和作用域相关的规则。

$scope对象的职责是承载DOM中指令所共享的操作和模型。

- 操作指的是$scope上的标准JavaScript方法。
- 模型指的是$scope上保存的包含瞬时状态数据的JavaScript对象。持久化状态的数据应该保存到服务中，服务的作用是处理模型的持久化。
- 控制器应该尽可能简单。虽然可以用控制器来组织所有功能，但是将业务逻辑移到服务和指令中是非常好的主意。

    <div ng-controller="SomeController">
        {{ someModel.someProperty }}
        <button ng-click="someAction">Communicate</button>
    </div>
    
    angular.module('myApp', [])
    .controller('SomeController', function($scope) {
        // 创建模型
        $scope.someModel = {
            // 添加属性
            someProperty: 'hello computer';    
        },
        // 设置$scope自身的操作
        $scope.someAction = function(){
            $scope.someModel.someProperty = 'hello human';    
        }
    })
  
在已有的控制器中嵌套第二个控制器：

    <div ng-controller="someController">
        {{ someBareValue }}
        <button ng-click="someAction()">Communicate to child</button>
        <div ng-controller="ChildController">
            {{ someBareValue }}
            <button ng-click="childAction()">Communicate to parent</button>
        </div>
    </div>
    
    angular.module('myApp', [])
    .controller('SomeProperty', function($scope){
        // 反模式，裸值
        $scope.someBareValue = 'hello Computer';
        // 设置 $scope 本身的操作，这样没问题
        $scope.someAction = function(){
            // 在SomeController和ChildController中设置{{ someBareValue }}
            $scope.someBareValue = 'hello human, from parent';
        }
    })
    .controller('ChildController', function($scope){
        $scope.childAction = function(){
            // 在ChildController中设置{{ someBareValue }}
            $scope.someBareValue = 'hello human, from child';
        }
    })
    
> Javascript 对象要么是值复制要么是引用复制。字符串、数字和布尔值变量是值复制。数组、对象和函数则是引用复制。

如果将模型对象某个属性设置为字符串，它会通过引用进行共享，因此在子$scope中修改属性也会修改父$scope中的这个属性。下面的例子展示了正确的做法：

    <div ng-controller="SomeController">
        {{ someModel.someValue }}
        <button ng-click="someAction()">Communicate to child</button>
        <div ng-controller="ChildController">
            {{ someModel.someValue }}
            <button ng-click="childAction()">Communicate to parent</button>
        </div>
    </div>
    
    angular.module('myApp', [])
    .controller('SomeController', function($scope) {
        // 最佳实践，永远使用一个模式
        $scope.someModel = {
            someValue = 'hello computer'
        } 
        $scope.someAction = function(){
            $scope.someModel.someValue = 'hello human, from parent';
        }
    })
    .controller('ChildController', function($scope){
        $scope.childAction = function(){
            $scope.someModel.someValue = 'hello human, from child';
        }
    })
    
**3. ng-include**

使用ng-include可以加载、编译并包含外部HTML片段到当前的应用中。

在同一个元素上添加onload属性可以在模板加载完成后执行一个表达式。

使用ng-include时AngualrJS会自动创建一个子作用域。如果想shi使用某个特定的作用域，例如ControllerA的作用域，必须在同一个DOM元素添加ng-controller="COntrollerA"指令。

    <div ng-include="/myTemplateName.html" ng-controller="MyController" ng-init="name = 'world'">
        Hello {{ name }}
    </div>
    
**4. ng-switch **

这个指令和ng-switch-when及on="propertyName"一起使用，可以在propertyName发生变化时渲染不同指令到视图中。

    <input type="text" ng-model="person.name" />
    <div ng-switch on="person.name">
        <p ng-switch-default>And the winner is</p>
        <h1 ng-switch-when="Ari">
            {{ person.name }}
        </div>
    </div>
    
**5. ng-view **

ng-view 指令用来设置将被路由管理和放置在HTML中的视图的位置。

**6. ng-if**

使用ng-if指令可以完全根据表达式的值在DOM中生成或移除一个元素。

ng-if同ng-show和ng-hide指令最本质的区别是，它不是通过CSS显示隐藏DOM节点，而是真正生成或移除节点。

当一个元素被ng-if从DOM中移除，同它关联的作用域也会被销毁。而且当重新加入DOM中时，会通过原型继承从它的父作用域生成一个新的作用域。

ng-if重新创建元素时用的是它们编译后的状态。

**7. ng-repeat**

ng-repeat 用来遍历一个集合或为集合中的每个元素生成一个模板实例。集合中的每个元素都会被赋予自己的模板和作用域。同时每个模板实例的作用域都会暴露一些特殊的属性。

- $index: 遍历的进度（0...length - 1）。
- $first: 当元素是遍历的第一个时值为true。
- $middle: 当一个元素处于第一个和最后一个元素之间时，值为true。
- $last: 当元素是遍历的最后一个时值为true。
- $even: 当$index值是偶数时值为true。
- $odd: 当$index值是奇数时为true。




    <ul ng-controller="PeopleController">
        <li ng-repeat="person in people" ng-class="{even: !$even, odd: !$odd}">
            {{person.name}} livesin {{person.city}} 
        </li>
    </ul> 
   
    .odd {
        background-color: blue;   
    }
    .even{
        background-color: red;
    }
    
    angular.module('myApp', [])
    .controller('PeopleCOntroller', function($scope) {
        $scope.people = [
            {name: 'Ari', city: 'San Francisco'},
            {name: 'Erik', city: 'Seattle'}
        ]
    })
    
    
**8. ng-init**

ng-init 指令用来在指令被调用时设置内部作用域的初始状态。

对于任何需要健壮性结构的场景，请在控制器中用数据模型对象来设置状态。

**9. {{ }}**

    <div>{{name}}</div>
    
{{ }} 语法是AngularJS内置的模板语法，它会在内部$scope和视图之间创建绑定。基于这个绑定，只要$scope发生变化，视图就会随之自动更新。

{{ }} 是指令，是 ng-bind 的简略形式，用这种形式不需要创建新的元素，因此它常常被用在行内文本中。

在屏幕可视区域内使用{{}}会导致页面加载时未渲染的元素发生闪烁，用ng-bind可以避免这个问题。

    <body ng-init="greeting='HelloWorld'">
        {{ greeting }}
    </body>
    
**10. ng-bind**

    <body ng-init="greeting='HelloWorld'"》
        <p ng-bind="greeting"></p>
    </body>
    
HTML 加载含有 {{}} 语法的元素后并不会立刻渲染它们，导致渲染内容闪烁(Flash of Unrendered Content, FOUC)。我们可以用ng-bind将内容同元素绑定在一起避免FOUC。内容会被当作子节点渲染到含有ng-bind指令的元素内。

**11. ng-cloak**

在含有{{ }} 的元素上使用ng-cloak指令:

    <body ng-init="greeting='HelloWorld'">
        <p ng-cloak>{{ greeting }}</p>
    </body>
    
**12. ng-bind-template**

在视图中绑定多个表达式。

    <div ng-bind-template="{{message}}{{name}}"></div>
    
**13. ng-model**

我们应该始终用ngModel来绑定$scope上一个数据模型内的属性，而不是$scope上的属性这样可以避免在作用域或后代作用域中发生属性覆盖。

    <input type="text" ng-model="modelName.someProperty" />
    
**14. ng-show/ng-hide**

ng-show和ng-hide根据所给表达式的值来显示或影藏HTML元素。

**15. ng-change**

这个指令会在表单输入发生时计算给定表达式的值。因为要处理表单输入，这个指令要和ngModel联合起来使用。

    <div ng-controller="EquactionController">
        <input type="text" ng-model="equation.x" ng-change="change()" />
        <code>{{ equation.output }}</code>
    </div>
    
    angular.module('myApp', [])
    .controller('EquationController', function($scope){
        $scope.equation = {};
        $scope.change = function(){
            $scope.equation.output() {
                $scope.equation.output = parseInt($scope.equation.x) + 2;
            }
        }
    })
    
**16. ng-form**
    
ng-form 用来在一个表单内部嵌套另一个表单。普通的HTML form 标签不允许嵌套，但ng-form可以。

这意味着内部所有子表达都合法时，外部的表单才会合法。这对于用ng-repeat动态创建表单非常有用。

下面的CSS类会根据表单的验证状态自动设置：

- 表单合法时设置ng-valid
- 表达不合法时设置ng-invalid
- 表单未进行修改时设置ng-pristion
- 表单进行过修改时设置ng-dirty

Angular不会将表单提交到服务器，除非它指定了action属性。要指定提交表单时调用哪个JavaScript方法，使用下面两个指令中的一个。

- ng-submit: 在表单元素上使用
- ng-click: 在第一个按钮或submit类型的输入字段上使用。

例子：

    angular.module('myApp', [])
    .controller('FormController', function($scope){
        $scope.fields = [
            {placeholder: 'UserName', isRequired: true} ,
            {placeholder: 'Password', isRequired:: true},
            {placeholder: 'Email(optional)', isRequired: false}
        ];
        $scope.submitForm = function(){
            alert('it works!');
        }
    })
    
    // 下面这些数据生成一个有验证功能的动态表单
    
    <form name="signup_form" ng-controller="FormController" ng-submit="submitForm()" novalidate>
        <div ng-repeat="field in fields" ng-form="signup_form_input">
            <input type="text" name="dynamic_input" ng-required="field.isRequired" ng-model="field.name" placeholder="{{field.placeholder}}" />
            <div ng-show="signup_form_input.dynamic_input.$dirty && signup_form_input.dynamic_input.$invalid">
            <span class="error" ng-show="signup_form_input.dynamic_input.$error.required"> The field is required.
            </span>
        </div>
        </div>
        <button type="submit" ng-disabled="signup_form.$invalid">
           Submit All
        </button>
    </form>
    
**17. ng-click**

ng-click 用来指定一个元素被点击时调用的方法或表达式。

    <div ng-controller="CounterController">
        <button ng-click="count = count + 1" ng-init="count=0">
        Increment
        </button>
        count: {{ count }}
        <button ng-click="decrement()">Decrement</button>
    </div>
    
    angular.module('myApp', [])
    .controller('CounterController', function($scope) {
        $scope.decrement = function() {
            $scope.count = $scope.count - 1;
        }
    })
    
**18. ng-select**

ng-select 用来将数据同HTML的select元素进行绑定。这个指令可以和ng-model以及ng-options指令一同使用，构建精细且表现优良的动态表单。

ng-options 的值可以有两种形式。

- 数组作为数据源
- 对象作为数据源

实例：

    <div ng-controller="CityController">
        <select ng-model="city" ng-options="city.name for city in cities">
            <option value="">Choose City</option>
        </select>
        Best City: {{ city.name }}
    </div>
    
    angular.module('myApp', [])
    .controller('CityController', function($scope) {
        $scope.cities = {
            {name: 'hangzhou'},
            {name: 'shanghai'},
            {name: 'beijing'}
        }
    })
    
**19. ng-submit**

ng-submit 用来将表达式同onsubmit事件进行绑定。这个指令同时会阻止默认行为（发送请求，并重新加载页面），除非表单不含有action属性。

    <form ng-submit="()" ng-controller="FormCOntroller">
        Enter text and hit enter:
        <input type="text" ng-model="person.name" name="person.name" />
        <input type="submit" name="person.name" value="Submit" />
        <code>people = {{people}}</code>
        <ul ng-repeat="(index, object) in people">
            <li> {{ object.name }} </li>
        </ul>
    </from>
    
    angular.module('myApp', [])
    .controller('FormController', function($scope) {
        $scope.person = {
            name = null
        };
        
        $scope.people = [];
        
        $scope.submit = function() {
            if($scope.person.name) {
                $scope.people.push({name: $scope.person.name});
                $scope.person.name = '';
            }
        }
    })
    
**20. ng-class**

使用ng-class动态设置元素的类，方法是绑定一个代表所需要添加的类的表达式。重复的类不会添加。当表达式发生变化，先前添加的类会被移除，新类会被添加。

    <div ng-controller="LotteryController">
        <div ng-class="{ red: x > 5 }" ng-if=" x > 5 ">
        You won!
        </div>
        <button ng-click="x = generateNumber()" ng-init="x = 0">
            Draw Number
        </button>
        <p>Number is: {{ x }}</p>
    </div>
    
    .red {
        backgournd:red;
    }
    
    angular.module('myApp', [])
    .controller('LotteryController', function($scope) {
        $scope.generateNumber = function() {
            return Math.floor((Math.random()*10) + 1);
        }
    })
    
**21. ng-attr-(suffix)**

当AngularJS编译DOM时会查找花括号{{ some expression }}内的表达式。这些表达式会被自动注册到$watch服务中被更新到$digest循环中，成为它的一部分:

   