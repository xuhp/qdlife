$(function(){
	var canvas=$('#myCanvas');
	var context=canvas.get(0).getContext('2d');
	
	var canvasWidth=canvas.width();
	var canvasHeight=canvas.height();
	
	$(window).resize(resizeCanvas);
	
	function resizeCanvas(){
		canvas.attr('width',$(window).get(0).innerWidth);
		canvas.attr('height',$(window).get(0).innerHeight);
		canvasWidth=canvas.width();
		canvasHeight=canvas.height();
	}
	
	resizeCanvas();
	
	var playAnimation=true;
	
	var startButton=$('#startAnimation');
	var stopButton=$('#stopAnimation');
	
	startButton.hide();
	startButton.click(function(){
		$(this).hide();
		stopButton.show();
		playAnimation=true;
		animate();
	})
	
	stopButton.click(function(){
		$(this).hide();
		startButton.show();
		playAnimation=false;
	})
	
	var Asteroid=function(x,y,radius,vx,vy,ax,ay){
		//
		this.x=x;
		this.y=y;
		this.radius=radius;
		//速度
		this.vx=vx;
		this.vy=vy;
		//加速度
		this.ax=ax;
		this.ay=ay;
	}
	
	var asteroids=new Array();
	
	for(var i=0;i<10;i++){
		var x=20+(Math.random()*(canvasWidth-40));
		var y=20+(Math.random()*(canvasHeight-40));
		var radius=5+Math.random()*10;
		var vx=Math.random()*4-2;
		var vy=Math.random()*4-2;
		var ax=0//Math.random()*0.2-0.1;
		var ay=0//Math.random()*0.2-0.1;
		asteroids.push(new Asteroid(x,y,radius,vx,vy,ax,ay));
	}
	
	function animate(){
		context.clearRect(0,0,canvasWidth,canvasHeight);
		context.fillStyle='rgb(255,255,255)';
		
		var asteroidsLength=asteroids.length;
		for(var i=0;i<asteroidsLength;i++){
			var tempAsteroid=asteroids[i];
			
			//碰撞检测
			for(var j=i+1;j<asteroidsLength;j++){
				var tempAsteroidB=asteroids[j];
				var dx=tempAsteroidB.x-tempAsteroid.x;
				var dy=tempAsteroidB.y-tempAsteroid.y;
				var distance=Math.sqrt(dx*dx+dy*dy);
				if(distance<tempAsteroid.radius+tempAsteroidB.radius){
					var angle=Math.atan2(dy,dx);
					var sine=Math.sin(angle);
					var cosine=Math.cos(angle);
					
					var x=0;
					var y=0;
					
					var xB=dx*cosine+dy*sine;
					var yb=dy*cosine-dx*sine;
					
					var vx=tempAsteroid.vx*cosine+tempAsteroid.vy*sine;
					var vy=tempAsteroid.vy*cosine-tempAsteroid.vx*sine;
					
					var vxb=tempAsteroidB.vx*cosine+tempAsteroidB.vy*sine;
					var vyb=tempAsteroidB.vy*cosine-tempAsteroidB.vs*sine;
					
					vx*=-1;
					vxb*=-1;
					
					xb=x+(tempAsteroid.radius+tempAsteroidB.radius);
					
					tempAsteroid.x=tempAsteroid.x+(x*cosine-y*sine);
					tempAsteroid.y=tempAsteroid.y+(y*cosine+x*sine);
					
					tempAsteroidB.x=tempAsteroid.x+(xb*cosine-yb*sine);
					tempAsteroidB.y=tempAsteroid.y+(yb*cosine+xb*sine);
					
					tempAsteroid.vx=vx*cosine-vy*sine;
					tempAsteroid.vy=vy*cosine+vy*sine;
					
					tempAsteroidB.vx=vxb*cosine-vyb*sine;
					tempAsteroidB.vy=vyb*cosine+vxb*sine;
				}
			}
			
			//为动画添加边界
			if(tempAsteroid.x-tempAsteroid.radius<0){
				tempAsteroid.x=tempAsteroid.radius;
				tempAsteroid.vx*=-1;
				tempAsteroid.ax*=-1;
			}else if(tempAsteroid.x+tempAsteroid.radius>canvasWidth){
				tempAsteroid.x=canvasWidth-tempAsteroid.radius;
				tempAsteroid.vx*=-1;
				tempAsteroid.ax*=-1;
			}
			if(tempAsteroid.y-tempAsteroid.radius<0){
				tempAsteroid.y=tempAsteroid.radius;
				tempAsteroid.vy*=-1;
				tempAsteroid.ay*=-1;
			}else if(tempAsteroid.y+tempAsteroid.radius>canvasHeight){
				tempAsteroid.y=canvasHeight-tempAsteroid.radius;
				tempAsteroid.vy*=-1;
				tempAsteroid.ay*=-1;
			}
			//加速度
			if(Math.abs(tempAsteroid.vx)<10){
				tempAsteroid.vx+=tempAsteroid.ax;
			}
			if(Math.abs(tempAsteroid.vy)<10){
				tempAsteroid.vy+=tempAsteroid.ay;
			}
			//摩擦力
//			if(Math.abs(tempAsteroid.vx)>0.1){
//				tempAsteroid.vx*=0.9;
//			}else{
//				tempAsteroid.vx=0;
//			}
//			if(Math.abs(tempAsteroid.vy)>0.1){
//				tempAsteroid.vy*=0.9;
//			}else{
//				tempAsteroid.vy=0;
//			}
			
			tempAsteroid.x+=tempAsteroid.vx;
			tempAsteroid.y+=tempAsteroid.vy;
			
			context.beginPath();
			context.arc(tempAsteroid.x,tempAsteroid.y,tempAsteroid.radius,0,Math.PI*2,false);
			context.closePath();
			context.fill();
		};
		if(playAnimation){
			setTimeout(animate,33);
		}
	}
	animate();
})











