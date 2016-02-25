#数据绑定和第一个 AngularJS Web 应用

##2.1 AngularJS 中的数据绑定

创建实时模板来代替视图。任何一个独立视图组件中的值都是动态替换的。

ng-app属性声明所有被包含的内容都属于这个AngularJS应用。

MVC是一种软件架构设计模式，它将表现从用户交互中分离出来。通常来讲，模型中包含应用的数据和数据进行交互的方法，视图讲数据呈现给用户，而控制器则是二者之间的桥梁。

AngularJS 会记录数据模型所包含的数据在任何特定时间点的值，而不是原始值。

dirty checking

处理事件合并、依赖跟踪和大量的事件触发（event firing）是非常复杂的。

> 为了表示内部和内置的函数库，Angualr 使用 $ 预定义对象。


##2.2 简单的数据绑定

> 双向数据绑定（bi-directional）意味着如果视图改变了某个值，数据模型会通过脏检查观察到这个变化，而如果数据模型改变了某个值，视图也会依据变化重新渲染。

使用 ng-model 指令来实现数据绑定。

DOM 元素上的 ng-controller 声明所有被它包含的元素都属于某个控制器。

**$timeout对象**

##2.3 数据绑定的最佳实践

在视图中通过对象的属性而非对象本身进行绑定，是Angular中的最佳实践。

	<div ng-controller="MyController">
		<h1>Hello {{ clock.now }}</h1>
	</div>

	function MyController($scope) {
		$scope.clock = {
			now: new Date()
		};
		var updateClock = function() {
			$scope.clock.now = new Date();
		}
		setInterval(function() {
			$scope.$apply(updateClock);
		}, 1000);
		updateClock();
	}

















