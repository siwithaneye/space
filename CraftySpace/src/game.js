Game = {

	map_grid: {
		width: 80,
		height: 60,
		tile: {
			width: 10,
			height: 10
		}
	},

	width: function(){
		return this.map_grid.width * this.map_grid.tile.width;
	},

	height: function(){
		return this.map_grid.height * this.map_grid.tile.height;
	},
  	
  	// Initialize and start our game
  	start: function() {
    	// Start crafty and set a background color so that we can see it's working
    	Crafty.init(Game.width(), Game.height());
    	Crafty.background('rgb(0, 0, 0)');

    	Crafty.scene('Loading');
    	
    	
  	}
}

$text_css = { 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' }
