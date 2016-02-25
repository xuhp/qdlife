var fs=require('fs');

fs.readFlie('content.txt',function(err,data){
	if(err){
		console.log(err);
	}else{
		console.log(data);
	}
})
