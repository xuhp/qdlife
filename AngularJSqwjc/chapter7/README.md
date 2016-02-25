#第7章 过滤器
 
 过滤器用来格式化需要展示给用户的数据。
 
 在HTML中的模板绑定符号{{}}内通过|符号来调用过滤器。
 
 ```
 {{ name | uppercase }}
 ```
 
 在JavaScript代码中可以通过$filter来调用过滤器。
 
 ```
 app.controller('DemoController', ['$scope', '$filter', function($scope, $filter) {
 	$scope.name = $filter('lowercase')('Ari');
 }])
 ```
 
 以HTML的形式使用过滤器时，如果需要传递参数给过滤器，只要在过滤器名字后面加冒号饥渴
 
 ```
 {{ 123.456789 | number:2 }}
 ```
 
 **1. currency**
 
 currecy 过滤器可以将一个数值格式化为货币格式。
 
 **2. date**
 
 将日期格式化成需要的格式。默认采用 mediumDate格式。
 
 **3. filter**
 
 从给定数组中选择一个子集，并将其生成一个新数组返回。
 
 这个过滤器第一个参数可以是字符串、对象或是一个用来从数组中选择元素的函数。
 
 - 字符串
 
 	返回所有包含这个字符串的元素。加! 为非。
 	
 	```
 	{{ ['Ari', 'lerner', 'Likes', 'To', 'Eat'] | filter:'e' }}
 	
 	<!-- ['Lerner', 'Likes', 'Eat'] -->
 	```
 
 - 对象
 
 	AngularJS会将待过滤对象的属性同这个对象中的同名属性进行比较，如果属性值是字符串就会判断是否包含该字符串。如果我们希望队全部属性进行对比，可以将$当作键名。
 	
 	```
 	{{
 	 [{
 	 	'name': 'xuhp',
 	 	'City': 'San Francisco',
 	 	'favorite food': 'Pizza'
 	 },{
 	 	'name': 'yunyou',
 	 	'City': 'hangzhou',
 	 	'favorite food': 'china food'
 	 }] | filter:{'favorite food': 'Pizza'}
 	}}
 	
 	<!-- [{'name':'xuhp','City':'San Francisco', 'favoritefood':'Piza'}] -->
 	```
 	
 - 函数
 
 	对每个元素都执行这个函数，返回非假值的元素会出现在新的数组中并返回。
 	
 	```
 	{{ ['Ari', 'likes', 'to', 'travel'] | filter:isCapitalized }}
 	
 	<!-- ['Ari'] -->
 	
 	
 	$scope.isCapitalized = function(str) {
 		return str[0] == str[0].toUpperCase();
 	}
 	```
 	
 filter 可以传入第二个参数，第二个参数可以是一下三种情况之一。
 
 - true
 
 用angular.equals(expected, actual) 对两个值进行严格比较。
 
 - false
 
 进行区分大小写的子字符串比较。
 
 - 函数
 
 运行这个函数，如果返回真值就接受这个元素。
 
 
 **4. json**
 
 json过滤器可以将一个JSON或JavaScript对象转换成字符串。这种转换对调试非常有帮助：
 
 ```
 {{ {'name': 'Ari', 'City': 'HangZhou'} | json }}
 
 <!--
 {
 	"name": "Ari",
 	"City": "HangZhou"
 }
 -->
 ```
 
 **5. limitTo**
 
 limitTo 过滤器会根据传入的参数生成一个新的数组或字符串，新的数组或字符串的长度取决于传入的参数，通过传入参数的正负值来控制从前面还是后面开始截取。
 
 如果传入的长度值大于被操作数组或字符串的长度，那么整个数组或字符串都会被返回。
 
 ```
 // 前三个字符
 {{ San Francisco is very cloudy | limitTo:3 }}
 
 <!-- San -->
 
 // 后六个字符
 {{ San Francisco is ver cloudy | limiTo:-6 }}
 
 <!-- cloudy -->
 
 // 返回第一个数组元素
 {{ ['a', 'b', 'c', 'd', 'e'] | limitTo: 1 }}
 
 <!-- ['a'] -->
 ```
 
 **6. lowercase**
 
 将字符串转为小写
 
 ```
 {{ 'San Francisco is very cloudy' | lowercase }}
 
 <!-- san francisco is very cloudy -->
 ```
 
 **7. number**
 
 将数字格式化成文本。
 
 > 如果传入了一个非数字字符，会返回空字符串。
 
 ```
 {{ 1234567890 | number }}
 
 <!-- 1,234,567,890 -->
 
 {{ 1.234567 | number:2 }}
 
 <!-- 1.23 -->
 ```
 
 **8.orderBy**
 
 对指定的数组进行排序
 
 第一个参数必填，用来确定数组排序方向的谓词：
 
 - 函数
 
 当第一个参数是函数时，该函数会被当作待排序对象的 getter 方法。
 
 - 字符串
 
 对这个字符串进行解析的结果将决定数组元素的排序方向。我们可以传入+或-来强制进行升序或降序排列。
 
 - 数组
 
 在排序表达式中使用数组元素作为谓词。对于表达式结果并不严格相等的每个元素，则使用第一个谓词。
 
 第二个参数用来控制排序的方向（是否逆向）
 
 将第二个参数设置为true可以将排序结果设置进行反转。
 
 **9. uppercase**
 
 将字符串转换为大写形式：
 
 ``` 
 {{ 'San Francisco'  | uppercase }}
 
 <!-- SAN FRANCISCO  -->
 ```
 
##7.1 自定义过滤器

将字符串第一个字母转换为大写。

 ```
 angular.module('myApp.filters', [])
 .filter('capitalize', function() {
 	return function(input) {}
 	}
 })
 ```
 
 过滤器本质上是一个会把我们输入的内容当作参数传入进去的函数。
 
 ```
 angular.module('myApp.filters', [])
 .filter('capitalize', function() {
 	return function(input) {
 		// inuput 是我们传入的字符串
 		if(input) {
 			return input[0].toUpperCase() + input.slice(1);
 		}
 	}
 }])
 ```
 
 **eg:**
 
 ```
 <!-- Ginger loves dog treats -->
 {{ 'ginger loves dog treats' | lowercase | capitalize }}
 ```
 
##7.2 表单验证

```
<form name="form" novalidate>
	<label name="email">Your email</label>
	<input type="email" name="email" ng-model="email" placeholder="Email Address" />
</form>
```

屏蔽浏览器对表单的默认行为，可以在表单元素上添加novalidate标记。

**1.必填项**

```
<input type="text" required />
```

**2. 最小长度**

```
<input type="text" ng-minlength="5" />
```

**3. 最大长度**

```
<input type="text" ng-maxlength="20" />
```

**4. 模式匹配**

<input type="text" ng-pattern="[a-zA-Z]" />

**5. 电子邮件**

将type设置为email

```
<input type="email" name="email" ng-model="user.email" />
```

**6. 数字**

将input类型设置为number

```
<input type="number" name="age" ng-model="user.age" />
```
**7. URL **

将input类型设置为url

```
<input type="url" name="homepage" ng-model="user.facebook_url" />
```
 
**8. 自定义验证**

**9. 在表单中控制变量**

我们可以对表单做出实时响应。

可以使用下面的格式访问这些属性：

formName.inputFieldName.property

- 未修改的表单

	这是一个不尔属性，用来判断用户是否修改了表单。如果未修改，值为true,如果修改过值为false:
	
	formName.inputFieldName.$pristine
	
- 修改过的表单

	只要用户修改过表单，无论输入是否通过验证，该值都返回true:
	
	formName.inputFieldName.$dirty

- 合法的表单

	判断表单内容是否合法。如果当前表单内容是合法的，下面属性的值就是true:
	
	formName.inputFieldName.$valid
	
- 不合法的表单

	formName.inputFieldName.$invalid

- 错误

	$error对象。包含当前保单的所有验证内容，以及它们是否合法的信息。
	
	formName.inputfieldName.$error
	
	如果验证失败，这个属性的值为true;如果值为false，说明输入字段的值通过了验证。

**10. 一些有用的css样式**

	.ng-pristine {}

	.ng-dirty {}

	.ng-valid {}

	.ng-invalid {}

当某个字段中的输入非法时， .ng-invlid 类会被添加到这个字段上。

- $parsers

 当用户同控制器进行交互，并且 ngModelController 中的 $setViewValue() 方法被调用时，$parsers 数组中的函数会以流水线的形式被逐个调用。第一个 $parse 被调用后，执行结果会被传递给第二个 $parse,以此类推。
 
 使用$parsers数组是实现自定义验证的途径之一。
 
 	angular.module('myApp')
 	.directive('oneToTen', function(){
 		return {
 			require '?ngModel',
 			link: function(scope, ele, attrs, ngModel) {
 				if (!ngModel) return;
 				ngModel.$parsers.unshift(
 					function(viewValue) {
 						var i = parseInt(viewValue);
 						
 						if(i > 0 && i < 10){
 							ngModel.$setValidity('oneToTen', true);
 							return viewValue;
 						} else {
 							ngModel.$setValidity('oneToTen', false);
 							return undefined;
 						}
 					} 					
 				)
 			}
 		}
 	})
 	
 - $formatters
 
 当绑定的 ngModel 值发生变化，并经过 $parsers 数组中解析器的处理后，这个值会被传递给$formatters流水线。$formatters 中的函数可以修改并格式化值。
 
 	angular.module('myApp')
	 .directive('oneToTen', function() {
 		reuturn {
 			require: '?ngModel',
 			link: function(scope, ele, attrs, ngModel){
 				if(!ngModel) return;
 				
 				ngModel.$formatters.unshift(function(v) {
 					return $filter('number')(v);
 				})
 			} 			
 		}
 	})
 	
 **11. 组合实例**
 
 
 定义表单：
 
 	<form name="signup_form" novalidate ng-submit="signupForm()">
 		<fieldset>
 		<legend>Signup</legend>
 			<!-- Your name -->
 			<div class="row">
 				<div class="large-12 columns">
 					<label>Your name</label>
 					<input type="text" placeholder="Name" name="name" ng-model="signup.name" ng-minlength="3" ng-maxlength="20" required />
 					<!-- $dirty 属性用来确保用户为对输入内容进行修改时错误内容不会显示出来 -->
 					<div class="error" ng-show="signup_form.name.$dirty && sigup_form.name.$invalid">
 						<small class="error" ng-show="signup_form.name.error.requires">
 							Your name is required.
 						</small>
 						<small class="error" ng-show="signup_form.name.$error.minlength">
 							Your name is required to be at least 3 characters
 						</small>
 						<small class="error" ng-show="signup_form.name.$error.maxlength">
 							Your name cannot be longer than 20 characters
 						</small>
 					</div> 
 				</div>
 			</div>
 			<!-- / Your name -->
 			<<!-- Your email -->
 			<div class="row">
 				<div class="large-12 columns">
 					<label>Your email</label>
 					<input type="email" placeholder="Email" name="email" ng-model="sigup.email" ng-minlength="3" ng-maxlength="20" required />
 					<div class="error" ng-show="signup_form.email.$dirty && sign_form.email.$invalid">
 						<small class="error" ng-show="signup_form.email.$error.required">
 						Your email is required.
 						</small>
 						<small class="error" ng-show="signup_form.email.$error.minlength">
 						Your email is required to be at least 3 cahracters
 						</samll>
 						<small class="error" ng-show="signup_form.email.$error.email">
 						That is not a valid email. Please input a valid email.
 						</small>
 						<small class="error" ng-show="signup_form.email.$error.maxlength">
 						Your email cannot be longer than 20 characters
 						</small>
 						</div>
 					</div>
 				</div>
 			</div>
 			<!-- /Your email -->
 			<!-- Username -->
 			<div class="large-12 columns">
 				<label>Username</label>
 				<input type="text" placeholder="Desired username" name="username" ng-model="signup.username" ng-minlength="3" ng-max-length="20" ensure-unique="username" required />
 				<div class="error" ng-show="signup_form.username.$dirty && signup_form.username.$invalid"> 
 					<small class="error" ng-show="signup_form.username.$error.required">
 					 Please input a username
 					</small>
 					<small class="error" ng-show="signup_form.username.$error.minlength">
 					Your username is required to be at least 3 characters
 					</small>
 					<small calss="error" ng-show="signup_form.username.$error.maxlength">
 					Your username is cannot be longer than 20 characters
 					</small>
 					
 					<smallclass="error" ng-show="signup_form.username.$error.unique">
 					That username is taken, please try another
 					</small>
 				</div>
 		   </div>
 			<!-- / Username -->
 		<button type="submit" class="button radius" ng-disabled="signup_form.$invalid">Submit</button>
 		</fieldset>
 	</form>
 
自定义验证是用AngularJS指令定义的：

	app.directive('ensureUnique', function($http) {
		return {
			require: 'ngModel',
			link: function(scope, ele, attrs, c) {
				if(!n) return;
				$http({
					method: 'POST',
					url: '/api/check/' + attrs.ensureUnique,
					data: {
						field: attrs.ensureUnique,
						value: scope.ngModel
					}
				}).success(function(data) {
					c.$setValidity('unique', data.isUnique);
				}).error(function(data){
					c.$setValidity('unique', false)
				})
			}
		}
	}) 

- 在提交后显示验证信息

当用户试图提交表单时，你可以在作用域中捕获到一个submitted值，然后对表单内容进行验证并显示错误信息。

在ng-show指令中加入对表单是否进行了提交的校验：

	<div class="error" ng-show="signup_form.name.$dirty && signup_form.name.$invalid && signup_form.submitted">
	...
	</div>
	
	app.controller('signupCOntroller', function($scope) {
		$scope.submitted = false;
		$scope.signupForm = function() {
			if($scope.signup_form.$valid){
				// 正常提交
			} else{
				$scope.signup_form.submitted = true;
			}
		}
	})
	
- 在失去焦点后显示验证信息

需要实现一个指令，并且向表单中添加这个指令。


	app.directive('ngFocus', [function() {
		var FOCUS_CLASS = 'ng-focused';
		return {
			restrict: 'A',
			require: 'ng-Model',
			link: function(scope, element, attrs, ctrl) {
				ctrl.$focused = false;
				element.bind('focus', function(evt){
					element.addClass(FOCUS_CLASS);
					scope.$apply(function() {
						ctrl.$focused = true;
					})
				}).bind('blur', function(evt){
					element.removeClass(FOCUS_CLASS);
					scope.$apply(functon() {
						ctrl.$focused = false;
					})
				})
				
			}
		}
	}])
	
将ngFocus指令添加到input元素上就可以使用这个指令：

	<input ng-class="{error: signup_form.name.$dirty & & signup_form.name.$invalid}" type="text" placeholder="Name" name="name" ng-model="signup.name" ng-minlength="3" ng-maxlength="20" required ng-focus />
	
###ngMessages(1.3+）

从1.3开始，Angualr中新增了一个ngMessages指令。



	$ bower install --save angular-message
	

	angular.module('myApp', ['ngMessage']);
	
使用ngMessages:

	<form name="signup_form" novalidate ng-submit="signupForm()" ng-controller="signupController">
		<label>Your name</lable>
		<input type="text" placeholder="Name" name="name" ng-model="signup.name" ng-minlength="3" ng-maxlength="20" required  />
		<div class="error" ng-messages="signup_form.name.$error">
			<div ng-messae="required">Make sure you enter your name</div>
			<div ng-message="minlength">Your name must be at least 3 characters</div>
			<div ng-message="maxlength">
			Your name cannot be longer than 20 characters</div>
		</div>
		<button type="submit"> Submit</div>
	</form> 

一次只会显示一个错误消息，如果要同时显示所有错误信息，只需要在ng-message指令旁边使用ng-messages-multiple属性即可。

很多时候这些信息相互之间非常相似。我们可以将它们保存到模板中从而减少麻烦。

	<!-- In templates/errors.html -->
	<div ng-message="required">This field is required</div>	<div ng-message="minlength">The field must be at least 3 characters</div>	<div ng-message="maxlength">The field cannot be longer than 20 characters</div>
在视图中使用ng-messages-include属性引入这个模板来改进表单：
	<div class="error" ng-message="signup_form.name.$error" ng-message-include="templates/errors.html" >
	</div>

可以为自定义验证创建自定义消息。

	app.directive('ensureUnipue', function($http) {
		return {
			require: 'ngModel',
			link: function(scope, ele, attrs, ctrl){
				ctrl.$parsers.push(function(val) {
					// 这里添加验证
				})
			}
		}
	})





















 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 