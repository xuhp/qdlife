/*
 * 创建TCP服务器
 * 开启telnet  在“搜索程序和文件”栏里输入“services.msc”或“服务”，找到
 * 登陆telnet 进入cmd 输入 telnet ip地址（域名）：端口（默认是23不用输入，如果修改了则要输入） 就可以了。
 */

var net=require('net');

var chatServer=net.createServer(),
	clientList=[];

chatServer.on('connection',function(client){
	client.name=client.remoteAddress+':'+client.remotePort;
	client.write('Hi'+client.name+'!\n');
	console.log(client.name+' joined');
	
	clientList.push(client);
	
	client.on('data',function(data){
		broadcast(data,client);
	})
	
	client.on('end',function(){
		clientList.splice(clientList.indexOf(client),1);
	})
	
	client.on('error',function(e){
		console.log(e);
	})
})

function broadcast(message,client){
	var cleanup=[];
	for(var i=0;i<clientList.length;i++){
		if(client!==clientList[i]){
			if(clientList[i].writable){
				clientList[i].write(client.name+' says ' +message) +'\n';
			}else{
				cleanup.push(clientList[i]);
				clientList[i].destroy();
			}
		}
	}
	//在写入循环中删除死节点，删除垃圾索引
	for(i=0;i<cleanup.length;i++){
		clientList.splice(clientList.indexOf(cleanup[i]),1)
	}
}

chatServer.listen(9000);
