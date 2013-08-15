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
	_speed:50,
	init: function(){
		this.requires('Actor, Color')
		.color('rgb(255, 255, 255)')		
		this.w = 2;
		this.h = 2;
		this.alpha = 0.8;
		this.bind('EnterFrame', this.frame);
	},

	frame: function(){	
		if(Math.random() < 0.001 && this._twinkle < 0)
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
		.origin(16, 16)
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

	_v: new Crafty.math.Vector2D(0, 0),	
	_vr: 0,
	_thrust: 0.0,
	_damp: 0.94,
	_rdamp: 0.9,
	init:function(){
		this.requires('2D');
		this.bind('EnterFrame', this.step);
	},

	step: function(){
		
		this._v.x += Math.sin((Math.PI/180) * this.rotation) * this._thrust;
		this._v.y += -Math.cos((Math.PI/180) * this.rotation) * this._thrust;

		this.x += this._v.x;
		this.y += this._v.y;
		this.rotation += this._vr;

		this._v.x *= this._damp;
		this._v.y *= this._damp;
		this._vr *= this._rdamp;
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