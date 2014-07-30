var events=require('events');

var emitter=new events.EventEmitter();

emitter.on('someEvent',function(arg1,arg2){
	console.log('listenter1',arg1,arg2);
});

emitter.on('someEvent',function(arg1,arg2){
	console.log('listenter2',arg1,arg2);
})

emitter.emit('someEvent','xuhp',1990);
