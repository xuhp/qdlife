#第6章 表达式
 
 当用$wacth进行监听时，AngualrJS会对表达式或函数进行运算。
 
 - 所有表达式都在其所属的作用域内部执行，并访问本地$scope的权限；
 - 如果表达式发生了TypeError和RefenceError并不会抛出异常；
 - 不允许使用任何流程控制功能（条件控制，例如if/else）；
 - 可以接受过滤器和过滤器链。
 
##6.1 解析 AngularJS 表达式

AngularJS 会在运行 $digest 循环的过程中自动解析表达式。

AngaulrJS通过$prase这个内部服务来进行表达式的运算，这个服务能够访问当前所处的作用域。这个过程允许我们访问定义在$scope上的原始JavaScript数据和函数。

将$prase服务注入到控制器中，然后调用它就可以实现手动解析表达式。


	<div ng-controller="myController">
		<input ng-model="expr" type="text" placeholder="Enter an expression" />
		<h2>{{ praseValue }}</h2>
	</div>
	
	
	angular.module('myApp', [])
	.controller('MyController', function($scope, $prase) {
		$scope.$watch('expr', function(newVal, oldVal, scope) {
			if(newVal !== oldVal) {
				// 用该表达式设置parseFun
				var parseFun = $parse(newVal);
				// 获取经过解析后表达式的值
				$scope.parsedValue = parseFun(scope);
			}
		});
	})

##6.2 插值字符串

$interpolate服务可以接受三个参数：

- text(字符串)： 一个包含字符插值标记的字符串
- mustHaveExpression(布尔型): 如果将这个参数设为true，当传入的字符串中不含由表达式时会返回null
- trustedContext(字符串): AngualrJS会对已经进行过字符插值操作的字符串通过$sec.getTrusted()方法进行严格的上下文转义。

```	
	<div ng-controller="MyController">
		<input ng-model="to" type="email" placeholder="Recipient" />
		<textarea ng-model="emailBody"></textarea>		<pre>{{ previewText }}</pre>
	</div>  
	
	
	
	angular.module('myApp', [])
	.controller('MyController', function($scope, $interpolate) {
		// 设置监听
		$scope.$watch('emailBody', function(body) {
			if(body){
				var template =  $interpolate(body);
				$scope.previewText = template({to: $scope});
			}
		})
	})
```

startSymbol()方法可以修改标识开始的符号。

- value(字符型): 开始符号的值。

endSymbol()方法可以修改标识结束的符号。

- value(字符型）：结束符号的值。

如果要修改这两个符号的设置，需要在创建新模块时将$interpolateProvider注入进去。

```
angualr.module('emialParser', [])
	.config(['$interpolateProvider', function($interpolateProvider) {
		$interpolateProvider.startSymbol('__');
		$interpolateProvider.endSymbol('__');
	}])
	.factory('EmailParser', ['$interpolate', function($interpolate) {
		// 处理解析的服务
		return {
			parse: function(text, content){
				var template = $interpolate(text);
				return template(context);
			}
		}
	}])
```

现在，已经创建了一个模块，可以将它注入到应用中：

```
	angular.module('myApp', ['emailParser'])
		.controller('MyController', ['$scope', 'EmailParser', function($scope, EmailParser) {
			// 设置监听
			$scope.$watch('emailBody', function(body) {
				if(body) {
					$scope.previewText = EmailParser.parse(body, {
						to: $scope.to
					})
				}
			})
		}])
```






















