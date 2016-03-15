#Mock

##Getting Started


    // 使用 Mock
    var data = Mock.mock({
        'list|1-10': [{
            'id|+1': 1
        }]
    })
    // 输出结果
    document.body.innerHTML += 
        'pre' +
        JSON.stringify(data, null, 4) +
        '</pre>'

###Random 

    # 全局安装
    $ npm install -g mockjs
    
    # 执行
    $ random url
    # => http://rmcpx.org/funzwc
    
    # 帮助
    random -h

##语法规范

Mock.js 的语法规范包括两部分

1. 数据模板定义规范(Data Template Definition, DTD)
2. 数据占位符定义规范(Data Placeholder Definition, DPD）

###数据模板定义规范

数据模板中的每个属性由3部分构成：属性名、生成规则、属性值：

    // 属性名 name
    // 生成规则 rule
    // 属性值 value
    'name|rule': value
    
注意：

- 属性名和生成规则之间用竖线 | 分割；
- 生成规则是可选的；
- 生成规则有7中格式：
    - 'name|min-max': value
    - 'name|count': value
    - 'name|min-max.dmin-dmax': value
    - 'name|min-max.dcount': value
    - 'name|count.dmin-dmax': value
    - 'name|count.dcount': value
    - 'name|+step': value
- 生成规则的含义需要依赖属性值的类型才能确定
- 属性值中可以含有@占位符
- 属性值还指定了最终值的初始值和类型

生成规则和示例：

1. 属性值是字符串 String

- 'name|min-max': string
- 'name|count': string

2. 属性值是数字 Number

- 'name|+1': number (不可用)
- 'name|min-max': number
- 'name|min-max.dmin-dmax': number

3. 属性值是布尔型 Boolean

- 'name|1': boolean
- 'name|min-max': value

4. 属性值是对象

- 'name|count': object
- 'name|min-max': object

5. 属性值是数组 Array

- 'name|1': array
- 'name|+1': array(不可用)
- 'name|min-max':array
- 'name|count': array

6. 属性值是函数 Function

- 'name': function

7. 属性值是正则表达式

- 'name':regexp

###数据占位符定义规范 DPD

占位符只是在属性字符串中占个位置，并不出现在最终的属性值中。

占位符格式：

    @占位符
    @占位符(参数[,参数])
    
注意：


1. 用 @ 来标识其后的字符串是占位符
2. 占位符引用的是 Mock.random 中的方法
3. 通过 Mock.Random.extend() 来扩展自定义占位符
4. 占位符也可以引用数据模板中的属性
5. 占位符会优先引用数据模板中的属性
6. 占位符支持相对路径和绝对路径

##Mock.mock()

###Mock.mock( template )

根据数据模板生成模拟数据

    var template = {
        'title': 'Syntax Demo',
        
        'String1|1-10': '★',
        'String2|3': 'value',
        
        'number1|+1': 100,
        'number2|1-100:' 100,
        'number3|1-100.1-10': 1,
        'number4|123.1-10': 1,
        'number5|123.3': 1,
        'bumber6|123.10': 1.123,
        
        'boolean1|1': true,
        'boolean2|1-2': true,
        
        'object1|2-4': {
            '110000': '北京市',
            '120000': '天津市',
            '130000': '河北省',
            '140000': '山西省'
        },
        'object2|2': {
            '310000': '上海市',
            '320000': '江苏省',
            '330000': '浙江省',
            '340000': '安徽省'
        },

        'array1|1': ['AMD', 'CMD', 'KMD', 'UMD'],
        'array2|1-10': ['Mock.js'],
        'array3|3': ['Mock.js'],

        'function': function() {
            return this.title
        }
    }

    var data = Mock.mock(template);
    $('<pre>').trxt(JSON.stringify(data, null, 4)).append('body');

###Mock.mock(rurl, tmplate)

记录数据模板。当拦截到匹配 rurl 的 Ajax 请求时，将根据数据模板 template 生成模拟数据，并作为响应数据返回。

###Mock.mock(rurl, function( options ))

记录用于生成响应数据的函数。当拦截到匹配 rurl 的 Ajax 请求时，函数 function(options) 将被执行，并把执行结果作为响应数据返回。

###Mock,mock(rurl, rtype, function( options ))

记录用于生成响应数据的函数。当拦截到匹配 rurl 和 rtype 的 Ajax 请求时，函数 function(options) 将被执行，并把执行结果作为响应数据返回。

###rurl 

可选。

表示需要拦截的url,可以是 URL 字符串或URL正则。

表示需要拦截的 Ajax 请求类型。例如 GET、POST、PUT、DELETE等。

###rtype

可选。



















#官网链接

[Mock](https://github.com/nuysoft/Mock/wiki)