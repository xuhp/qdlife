var http=require('http');
var querystring=require('querystring');

var contents=querystring.stringify({
	name:'xuhp',
	email:'xuhp@ct108.com',
	address:'zhexinxiaoqu,bingjiang,hangzhou'
});

var options={
	host:'www.xuhp.com',
	path:'/application/node/post.php',
	method:'POST',
	headers:{
		'Content-Type':'application/x-www-.form-urllencoded',
		'Content-Length':contents.length
	}
};

var req=http.request(options,function(res){
	res.setEncoding('utf8');
	res.on('data',function(data){
		console.log(data);
	})
});

req.write(contents);
req.end();
