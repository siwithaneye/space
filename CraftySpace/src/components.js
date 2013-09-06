Crafty.c('Grid', {
	init: function(){
		this.attr({
			w:Game.map_grid.tile.width,
			h:Game.map_grid.tile.height
		})
	},

	at: function(x, y){
		if(x == undefined && y == undefined){
			return {x : this.x / Game.map_grid.tile.width, y:this.y/Game.map_grid.tile.height}
		}else{
			this.attr({x: x * Game.map_grid.tile.width, y : y*Game.map_grid.tile.height});
			return this;
		}
	}
});

Crafty.c('Actor', {
	init:function() {
		this.requires('2D, Canvas, Grid');
	},
})

Crafty.c('Tree', {
	init: function(){
		this.requires('Actor, Color, Solid')
		.color('rgb(20, 125, 40)');
	},
});

Crafty.c('Bush', {
	init: function(){
		this.requires('Actor, Color, Solid')
		.color('rgb(20, 185, 40)');
	},
});

Crafty.c('Star', {
	_twinkle:-1,
	_maxAlpha:0.8,
	_minAlpha:0.0,
	_speed:100,
	init: function(){
		this.requires('Actor, Color')
		.color('rgb(255, 255, 255)');	
		this.w = 2;
		this.h = 2;
		this.alpha = 0.8;
		this.bind('EnterFrame', this.frame);
	},

	frame: function(){	
		if(Math.random() < 0.005 && this._twinkle < 0)
		{
			this._twinkle = this._speed;
			this.alpha = this._maxAlpha;
		}

		if(this._twinkle > this._speed/2)
		{
			this._twinkle--;
			this.alpha -= 1/(this._speed/2);
			//console.log('twinkling:' + this._twinkle + "alpha" + this.alpha);
		}
		else if(this._twinkle >= 0)
		{
			this._twinkle--;
			this.alpha += 1/(this._speed/2);
		}
		
		if(this.alpha < this._minAlpha)
			this.alpha = this._minAlpha;

	}
});

Crafty.c('PlayerCharacter', {
	init: function(){
		this.requires('Actor, Image, Collision, PlayerControls')		
		.stopOnSolids()
		.onHit('Village', this.visitVillage)
		.image('assets/spaceship2.png')
		.origin(16, 16);
	},

	stopOnSolids: function()
	{
		this.onHit('Solid', this.stopMovement);
		return this;
	},

	stopMovement: function(){
		this._speed = 0;
		if(this._movement){
			this.x -= this._movement.x;
			this.y -= this._movement.y;
		}
	},

	  // Respond to this player visiting a village
	  visitVillage: function(data) {
	    villlage = data[0].obj;
	    villlage.collect();
	  },

});


Crafty.c('Village', {
  init: function() {
    this.requires('Actor, Color')
      .color('rgb(170, 125, 40)');
  },
 
  collect: function() {
    this.destroy();
    Crafty.trigger('VillageVisited', this);
  }
});

Crafty.c('ShipPhysics', {

	_vx: 0,	
	_vy: 0,
	_vr: 0,
	_thrust: 0.0,
	_damp: 0.94,
	_rdamp: 0.9,
	init:function(){
		this.requires('2D');
		this.bind('EnterFrame', this.step);
	},

	step: function(){
		
		this._vx += Math.sin((Math.PI/180) * this.rotation) * this._thrust;
		this._vy += -Math.cos((Math.PI/180) * this.rotation) * this._thrust;

		this.x += this._vx;
		this.y += this._vy;
		this.rotation += this._vr;

		this._vx *= this._damp;
		this._vy *= this._damp;
		this._vr *= this._rdamp;
	},
})

Crafty.c('Physics', {

	_vx: 0,
	_vy: 0,
	_vr: 0,	
	_damp: 1.0,
	_rdamp: 1.0,

	init:function(){
		this.requires('2D');
		this.bind('EnterFrame', this.step);		
	},

	step: function(){
		
		this.x += this._vx;
		this.y += this._vy;
		this.rotation += this._vr;

		this._vx *= this._damp;
		this._vy *= this._damp;
		this._vr *= this._rdamp;
	},

	vx:function(x){
		this._vx = x;
		return this;
	},

	vy:function(y){
		this._vy = y;
		return this;
	},

	vr:function(r){
		this._vr = r;
		return this;
	},

	
})

Crafty.c('Bullet', {

	init: function(){
		this.onHit('Asteroid', this.hitAsteroid);
	},

	hitAsteroid: function(data){
		var asteroid = data[0].obj;
		asteroid.explode();
		this.destroy();
	},
})

Crafty.c('Asteroid', {

	
	_size: 2,

	init:function(){

	},
	  
	explode: function(){
		switch(this._size){
		
		case 2:
			this.spawnAsteroid(this.x, this.y, 'assets/smallrock2.png');
			this.spawnAsteroid(this.x, this.y, 'assets/smallrock2.png');
			this.destroy();
			break;
		case 1:
			this.spawnAsteroid(this.x, this.y, 'assets/smallrock3.png');
			this.spawnAsteroid(this.x, this.y, 'assets/smallrock3.png');
			this.destroy();
			break;
		default:		
			this.destroy();
			break;
		}	
	},

	size:function(size){
		this._size = size;
	},

	spawnAsteroid: function(x, y, img){

		Crafty.e('Actor, Image, Collision, Physics, Asteroid')
		.attr({
        		x:x, 
        		y:y,
        		rotation:0, 
        })
        .image(img)
        .vx(this._vx + (-1.2 + Math.random()*2.4))
        .vy(this._vy + (-1.2 + Math.random()*2.4))
        .vr(Math.random() * Math.PI * 0.3 + (Math.PI*0.1))
        .origin("center")
        .size(this._size-1);
	},
})


Crafty.c('AsteroidManager', {

	_rate: 4000,
	_timeTilNext: 0,

	init:function(){
		this.requires('2D');
		this.bind('EnterFrame', this.step);
		this._timeTilNext = this._rate;
	},

	step: function(event){
		this._timeTilNext -= event.dt;		
		if(this._timeTilNext <= 0)
		{
			this._timeTilNext += this._rate;
			this.spawnAsteroid();
		}
				
	},

	spawnAsteroid: function(){
		var x = -100;
		var y = Math.random() * 600;

		Crafty.e('Actor, Image, Collision, Physics, Asteroid')
		.attr({
        		x:x, 
        		y:y,
        		rotation:0, 
        })
        .image('assets/smallrock.png')
        .vx(0.5)
        .vr(Math.random() * Math.PI * 0.3 + (Math.PI*0.1))
        .origin(50, 50);        
	},
	
})



Crafty.c('PlayerControls', {

	_turnSpeed: 1.9,
	_thrustSpeed: 0.45,
	_thrusting: false,
	_left: false,
	_right: false,

	init:function(){
		this.requires('ShipPhysics', 'Keyboard')
		.bind('EnterFrame', this.frame)
		.bind('KeyDown', this.keyDown)
		.bind('KeyUp', this.keyUp)
	},

	frame:function(){
		if(this._left)
			this._vr = -this._turnSpeed;

		if(this._right)
			this._vr = this._turnSpeed;

		if(this._thrusting)
			this._thrust = this._thrustSpeed;
		else
			this._thrust = 0;
	},

	keyDown: function(e){
		if(e.key == Crafty.keys['LEFT_ARROW']) {
       		this._left = true;
     	} else if (e.key == Crafty.keys['RIGHT_ARROW']) {
     		this._right = true;
        } else if (e.key == Crafty.keys['UP_ARROW']) {
        	this._thrusting = true;
        } else if (e.key == Crafty.keys['DOWN_ARROW']) {
        	
        } else if (e.key == Crafty.keys['SPACE']) {        	

        	var ship = Crafty.e('Actor, Image, Physics, Collision, Bullet')        	
        	.attr({
        		x:this.x + 8, 
        		y:this.y + 16,
        		rotation:this.rotation, 
        	})
        	.image('assets/bullet.png')
        	.vx(Math.sin(this.rotation*(Math.PI/180)) * 15)
        	.vy(-Math.cos(this.rotation*(Math.PI/180)) * 15)
        	

        	//console.log('x:' + this.x + ' y:' + this.y + ' ox:' + this.origin.x + ' oy:' + this.origin.y);
        	//.vy(Math.cos(this.rotation*(Math.PI/180)) * 1)

			
        }
	},

	keyUp: function(e){
		if(e.key == Crafty.keys['LEFT_ARROW']) {
       		this._left = false;
     	} else if (e.key == Crafty.keys['RIGHT_ARROW']) {
     		this._right = false;
        } else if (e.key == Crafty.keys['UP_ARROW']) {
        	this._thrusting = false;
        } else if (e.key == Crafty.keys['DOWN_ARROW']) {
        	
        }
	}

	
})