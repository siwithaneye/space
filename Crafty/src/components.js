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

Crafty.c('PlayerCharacter', {
	init: function(){
		this.requires('Actor, Fourway, Color, Collision')
		.fourway(1)
		.color('rgb(20, 75, 40)')
		.stopOnSolids()
		.onHit('Village', this.visitVillage);
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