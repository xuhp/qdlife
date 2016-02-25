#第5章 控制器
 AngualrJS中的控制器是一个函数，用来向视图的作用域中添加额外的功能。我们用它来给作用域对象设置初始状态，并添加自定义行为。
 
 当我们在页面上创建一个新的控制器时，AngularJS会生成并传递一个新的 $scope 给这个控制器。
 
 控制器的初始化：
 
 ```
 	function firstController($scope) {
 		$scope.message = 'hello';
 	}
 ```
 
 > 将控制器命名为[name]Controller而不是[name]Ctrl是一个最佳实践。
 
 创建一个模块，然后再模块中创建控制器：
 
 ```
 	var app = angualr.module('app', []);
 	app.controller('FirstController', function($scope){
 		$scope.message = 'hello';
 	})
 ```
 
 AngaulrJS 允许我们在视图中像调用普通数据一样调用$scope上的函数。
 
 **ng-clcik:**
 
 ```
 	<div ng-controller="FirstController">
 		<h4>The simplest adding machine ever</h4>
 		<button ng-click="add(1)" class="button">Add</button>
 		<button ng-click="substract(1)" class="button alert">Subtract</button>
 		<h4>Current count: {{ counter }}</h4>
 	</div> 
 	
 	
 	app.controller('FirstController', function($scope) {
 	$scope.counter = 0;
 	$scope.add = function(amount) { $scope.counter += amount; };
 	$scope.substract = function(amount) { $scope.counter -= amount };
 	);
 ```
 
 控制器可以将与一个独立视图相关的业务逻辑封装在一个独立的容器中。尽可能地精简控制器是很好的做法。使用依赖注入来访问服务可以实现这个目的。
 
 AngualrJS 允许在$scope上设置包括对象在内的任何类型的数据，并且在视图中还可以展示对象的属性。
 
 在拥有ng-controller='MyController'这个属性的元素内部的任何子元素中，都可以访问person对象，因为它是定义在$scope上的。
 
 $scope对象用来从数据模型向视图传递信息。同时，它也可以用来设置事件监听器，同应用的其他部分进行交互，以及创建与应用相关的特定业务逻辑。
 
 AngualrJS通过作用域将视图、控制器和指令隔离开来，这样就很容易为功能的具体部分编写测试。
 
 ##5.1 控制器嵌套（作用域包含作用域）
 
 > 在指令内部创建的作用域被称作孤立作用域
 
 除了孤立作用域外，所有的作用域都通过原型继承而来。
 
 如果在$rootScope中也找不到某个属性，程序会继续运行，但视图无法更新。
 
 ```
 	app.controller('ParentController', function($scope) {
 		$scope.person = {greeted: false};
 	});
 	app.controller('ChildController', function($scope){
 		$scope.sayHello = function() {
 			$scope.person.name = 'Ari Lerner'
 		}
 	})
 	
 	
 	<div ng-controller="ParentController">
 		<div ng-controller="ChildController">
 			<a ng-click="sayHello()">Say Hello</a>
 		</div>
 		{{ person }}
 	</div>
 	
 ```
 
 
 控制器应该尽可能保持短小精悍，而在控制器中进行DOM操作和数据操作则是一个不好的实践。
 
 ```
 // 臃肿的控制器
 angualr.module('myApp', [])
 .controller('MyController', function($scope) {
 	$scope.shouldShowLogin = true;
 	$scope.showLogin = function(){
 		$scope.shouldShowLogin = !$scope.shouldShowLogin;
	};
	$scope.clickButton = function() {
		$('#btn span').html('Clicked');
	}
	$scope.onLogin = function(user) {
		$http({
			method: 'POST',
			url: '/login',
			data: {
				user: user
			}
		}).success(function(data) {
			// user
		});
	};
 });
 
 ```
 
 设计良好的应用会将复杂的逻辑放到指令和服务中。通过指令和服务，我们可以将控制器重构成一个轻量级切更易维护的形式。
 
 ```
 // 简洁的控制器
 angular.module('myApp', [])
 .controller('MyController', function($scope, UserSrv) {
 	// 内容可以被指令控制
 	$scope.onLogin = function(user) {
 		UserSrv.runLogin(user);
 	}
 })
 ```
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
