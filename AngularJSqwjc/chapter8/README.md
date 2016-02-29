#第8章 指令简介
 
浏览器会渲染HTML元素的样式和行为，这个能力是Web强大功能的基础之一。

##8.1 指令：自定义 HTML 元素和属性

指令本质上是AngularJS扩展具有自定义功能的HTML元素的途径。

指令可以和其他指令或属性组合在一起使用，这种组合方式叫做合成。

###1. HTML引导

> 内置指令是打包在AngularJS内部的指令。所有内置指令的命名空间都使用ng作为前缀。为了防止命名冲突，不要在自定义指令前加ng前缀。

	<html ng-app="myApp">
		<!-- 应用的$rootScope -->
	</html>
	
使用ng-app标记出根节点，就可以再内部使用所有内置或自定义指令了。

###2. 我们的第一个指令

	<my-directive></my-directive>
	
调用指令意味着执行指令背后与之相关联的JavaScript代码，这些代码是我们用指令定义写出来的。

	angular.module('myApp',[])
	.directive('myDirective', function() {
		return {
			restrict: 'E',
			template: '<a href="http://www.baidu.com">Click me go to baidu</a>'
		};
	})
	
指令应该是驼峰命名风格，函数应该返回一个对象。

directive() 方法返回的对象中包含了用来定义和配置指令所需的方法和属性。

默认情况下，AngualrJS将模板生成的HTML代码嵌套在自定义标签<my-directive>内部。

	angular.module('myApp', [])
	.directive('myDirective', function() {
		return {
			restrict : 'E',
			replace: true,   // 将自定义标签从生成的DOM中完全移除掉，只留下模板生成的链接,
			template: '<a href="www.baidu.com">Click</a>'
		}
	})
	
我们把创建的这些自定义元素称作指令（用.driective()方法创建），事实上声明指令并不需要创建一个新的自定义元素。

下面都是都是用来声明前面创建指令的合法方式：

	<my-directive></my-directive>
	<div my-directive></div>
	<div class="my-directive"></div>
	<!-- directive:my-directive --->

restrict可以指定一个或多个格式。元素（E）、属性（A）、类（C）或注释（M）。

无论由多少种方式可以声明指令，我们坚持使用属性方式，因为它由比较好的跨浏览器兼容性。

###3. 关于IE浏览器

扩展内置HTML标签，例如用AngularJS重载 a form input 。这些场景不会导致浏览器兼容性问题，因为它们本身就是浏览器所支持的标签。

###4. 表达式

	<h1 ng-init="greeting='HelloWorld'">
		The greeting is: {{ greeting }}
	</h1>
	
- 用表达来声明指令

声明指令时既可以使用表达式，也可以不实用表达式。

	<my-directive="someExpression">
	</my-directive>
	
	<div my-directive="someExpression">
	</div>
	
	<div class="my-directive:someExpression">
	</div>
	
	<!-- directive: my-directive someExpression -->

当前作用域，由DOM周围嵌套的控制器提供。

- 当前作用域介绍

ng-controller 是在DOM中创建一个新的子作用域：
	
	<p>We can access: {{rootProterty }} </p>
	<div ng-controller="ParentController">
		<p>We can access: 
			{{ rootPreperty }} and 
			{{ parentProperty }}
		</p>
		<div ng-controller="ChildController">
			<p>We can access:
				{{ rootProperty }} and 
				{{ parentProperty }} and 
				{{ childProperty }}
			</p>
			<p>
				{{ fullSentenceFromChild }}
			</p>
		</div>
	</div>
	
	
	angular.module('myApp', [])
	.run(function($rootScope) {
		// 使用 .run 访问 $rootScope
		$rootScope.rootProperty = 'root scope';
	})
	.controller('ParentController', function($scope) {
		// 使用 .controller 访问 'ng-controller'内部的属性
		// 在DOM忽略的$scope中，根据当前控制器进行推断
		$scope.parentProperty = 'parent scope'; 
	})
	.controller('ChildController', function($scope){
		$scope.childProperty = 'child scope';
		// 同在DOM中一样，我们可以通过当前$scope直接访问原型中的任意属性
		$scope.fullSentenceFromChild = 'Same $scope: We can access: ' + 
		$scope.rootProperty + ' and ' +
		$scope.parentProperty + ' and '+
		$scope.childProperty
	})

其他内置指令(ng-include和ng-view)也会创建子作用域。我们在构造自定义指令时也可以创建新的子作用域。

##8.2 向指令中传递数据

用属性将数据从DOM中复制到指令的隔离作用域中：

	<div my-directive my-url="http://www.baidu.com" my-link="Click me to go to baidu">
	</div>
	
	angular.module('myApp', [])
	.directive('myDirective', function() {
		return {
			restrict: 'A',
			replace: true,
			scope: {
				myUrl: '@',   // 绑定策略
				myLinkText: '@'   // 绑定策略
			},
			template: '<a href="{{myUrl}}"' + 
				'{{myLinkText}}</a>'
		};
	});
	
    


















