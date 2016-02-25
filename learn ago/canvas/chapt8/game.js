$(function(){
	var canvas=$('#gameCanvas');
	var context=canvas.get(0).getContext('2d');
	
	//画布尺寸
	var canvasWidth=canvas.width();
	var canvasHeight=canvas.height();
	
	//游戏设置
	var playGmae;
	//激活用户界面
	var ui=$('#gameUI');
	var uiIntro=$('#gameIntro');
	var uiStats=$('#gameStats');
	var uiComplete=$('#gameComplete');
	var uiPlay=$('#gamePlay');
	var uiReset=$('gamePlay');
	var uiRemaining=$('#gameRemaining');
	var uiScore=$('#gameScore');
	//圆形平台
	var platformX;
	var platformY;
	var platformOuterRadius;
	var platformInnerRadius;
	//小行星
	var asteroids;
	var Asteroid=function(x,y,radius,mass,friction){
		this.x=x;
		this.y=y;
		this.radius=radius;
		this.mass=mass;
		this.friction=friction;
		this.vX=0;
		this.vY=0;
		this.palyer=false;
	}
	//玩家小行星
	var player;
	var playerOriginalX;
	var playerOriginalY;
	
	//重置和启动游戏
	function startGame(){
		uiScore.html('0');
		uiStats.show();
		//初始化游戏设置
		playGame=false;
		//初始化平台
		platformX=canvasWidth/2;
		platformY=150;
		platformOuterRadius=100;
		platformInnerRadius=75;
		//初始化小行星
		asteroids=new Array();
		var outerRing=8;//外圈上的小行星数目
		var ringCount=3;//圈数
		var ringSpacing=(platformInnerRadius/(ringCount-1));//每个间距之间的距离
		for(var r=0;r<ringCount;r++){
			var currentRing=0;//当前圈上小行星的数目
			var angle=0;//每颗小行星之间的角度
			var ringRadius=0;
			//这是最里面的圈吗
			if(r==ringCount-1){
				currentRing=1;
			}else{
				currentRing=outerRing-(r*3);
				angle=360/currentRing;
				ringRadius=platformInnerRadius-ringSpacing*r;
			}
			//遍历小行星
			for(var a=0;a<currentRing;a++){
				var x=0;
				var y=0;
				
				//这是最里面的圈吗
				if(r==ringCount-1){
					x=platformX;
					y=platformY;
				}else{
					x=platformX+(ringRadius*Math.cos((angle*a)*(Math.PI/180)));
					y=platformY+(ringRadius*Math.sin((angle*a)*(Math.PI/180)));
				};
				var radius=10;
				var mass=5;
				var friction=0.95;
				asteroids.push(new Asteroid(x,y,radius,mass,friction));
			}
			//
		}
		//初始化玩家小行星
		var pRadius=15;
		var pMass=10;
		var pFriction=0.97;
		playerOriginalX=canvasWidth/2;
		playerOriginalY=canvasHeight-150;
		player=new Asteroid(playerOriginalX,playerOriginalY,pRadius,pMass,pFriction);
		player.player=true;
		asteroids.push(player);
		uiRemaining.html(asteroids.length-1);
		//开始动画循环
		animate();
	}
	//初始化游戏环境
	function init(){
		uiStats.hide();
		uiComplete.hide();
		
		uiPlay.click(function(e){
			e.preventDefault();
			uiIntro.hide();
			startGame();
		})
		
		uiReset.click(function(e){
			e.preventDefault();
			uiComplete.hide();
			startGame();
		})
	}
	//动画循环，游戏的趣味性就再这里
	function animate(){
		//清除
		context.clearRect(0,0,canvasWidth,canvasHeight);
		//绘制平台
		context.fillStyle='rgb(100,100,100)';
		context.beginPath();
		context.arc(platformX,platformY,platformOuterRadius,0,2*Math.PI,true);
		context.closePath();
		context.fill();
		//计算新位置
		tmpAsteroid.x+=tmpAsteroid.vX;
		tmpAsteroid.y+=tmpAsteroid.vY;
		//摩擦力
		if(Math.abs(tmpAsteroid.vX)>0.1){
			tmpAsteroid.vX*=tmpAsteroid.friction;
		}else{
			tmpAsteroid.vX=0;
		}
		if(Math.abs(tmpAsteroid.vY)>0.1){
			tmpAsteroid.vY*=tmpAsteroid.friction;
		}else{
			tmpAsteroid.vY;
		}
		
		//绘制小行星
		context.fillStyle='rgb(255,255,255)';
		var asteroidsLength=asteroids.length;
		for(var i=0;i<asteroidsLength;i++){
			var tmpAsteroid=asteroids[i];
			for(var j=i+1;j<asteroidsLength;j++){
				var tmpAsteroidB=asteroids[j];
				//碰撞检测
				var dX=tmpAsteroidB.x-tmpAsteroid.x;
				var dY=tmpAsteroidB.y-tmpAsteroid.y;
				var distance=Math.sqrt((dX*dX)+(dY*dY));
				if(distance<tmpAsteroid.radius+tmpAsteroidB.radius){
					var angle=Math.atan2(dY,dX);
					var sine=Math.sin(angle);
					var cosine=Math.cos(angle);
					
					//旋转小行星的位置
					var x=0;
					var y=0;
					
					//旋转小行星B的位置
					var xB=dX*cosine+dY*sine;
					var yB=dY*cosine-dX*sine;
					
					//旋转小行星的速度
					var vX=tmpAsteroid.vX*cosine+tmpAsteroid.vY*sine;
					var vY=tmpAsteroid.vY*cosine-tmpAsteroid.vX*sine;
					
					//旋转小行星B的速度
					var vXb=tmpAsteroidB.vX*cosine+tmpAsteroidB.vY*sine;
					var vYb=tmpAsteroidB.vX*sine-tmpAsteroidB.vY*cosine;
					
					//保持动量,由动量守恒和能量守恒两式联立而得
					var vTotal=vX-vXb;
					vX=((tmpAsteroid.mass-tmpAsteroidB.mass)*vX+2*tmpAsteroidB.mass*vXb)/(tmpAsteroid.mass+tmpAsteroidB.mass);
					vXb=vTotal-vX;
					
					//将小行星分开
					xB=x+(tmpAsteroid.radius+tmpAsteroidB.radius);
					
					//转回小行星的位置
					tmpAsteroid.x=tmpAsteroid.x+(x*cosine-y*sine);
					tmpAsteroid.y=tmpAsteroid.y+(y*cosine+x*sine);
					
					tmpAsteroidB.x=tmpAsteroid.x+(xB*cosine-yB*sine);
					tmpAsteroidB.y=tmpAsteroid.y+(yB*cosine+xB*sine);
					
					//转回小行星的速度
					tmpAsteroid.vX=vX*cosine-vY*sine;
					tmpAsteroid.vY=vY*cosine+vX*sine;
					
					tmpAsteroidB.vX=vXb*cosine-vYb*sine;
					tmpAsteroidB.vY=vYb*cosine+vXb*sine;
				}
			}
			context.beginPath();
			context.arc(tmpAsteroid.x,tmpAsteroid.y,tmpAsteroid.radius,0,Math.PI*2,true);
			context.closePath();
			context.fill();
		}
		
		
		if(playGame){
			//33毫秒后再次运行动画循环
			setTimeout(animate,33);
		}
	}
	
	init();
})
