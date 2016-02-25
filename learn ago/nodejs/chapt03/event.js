var EventEmitter=require('events').EventEmitter;
var event=new EventEmitter();

event.on('some_event',function(){
	console.log('some_event occured.');
});

setTimeout(function(){
	event.Emit('some_event');
},1000);
