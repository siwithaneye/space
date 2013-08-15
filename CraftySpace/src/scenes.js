Crafty.scene('Game', function() {
 
  Crafty.e('2D, Canvas, Image').image("assets/spacebg2.png");

  // A 2D array to keep track of all occupied tiles
  this.occupied = new Array(Game.map_grid.width);
  for (var i = 0; i < Game.map_grid.width; i++) {
    this.occupied[i] = new Array(Game.map_grid.height);
    for (var y = 0; y < Game.map_grid.height; y++) {
      this.occupied[i][y] = false;
    }
  }
 
  // Player character, placed at 5, 5 on our grid
  this.player = Crafty.e('PlayerCharacter').at(40, 40);
  this.occupied[this.player.at().x][this.player.at().y] = true;
 
  // Place a tree at every edge square on our grid of 16x16 tiles
  for (var x = 0; x < Game.map_grid.width; x++) {
    for (var y = 0; y < Game.map_grid.height; y++) {
      if (Math.random() < 0.02 && !this.occupied[x][y]) {
        // Place a bush entity at the current tile
        Crafty.e('Star').at(x, y);
        this.occupied[x][y] = true;

      }
    }
  }

Crafty.e("2D,DOM,FPS,Text").attr({maxValues:10}).bind("MessureFPS",function(fps){ this.text("FPS"+fps.value); })
 
  this.show_victory = this.bind('VillageVisited', function() {
    if (!Crafty('Village').length) {
      Crafty.scene('Victory');
    }
  });
}, function() {
  this.unbind('VillageVisited', this.show_victory);
});

Crafty.scene('Victory', function() {
	Crafty.e('2D, DOM, Text')
	.attr({x:0, y:0})
	.text('Victory!');

	this.restart_game = this.bind('KeyDown', function(){
		Crafty.scene('Game');
	});
}, function(){
	this.unbind('KeyDown', this.restart_game);
});




// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  Crafty.e('2D, DOM, Text')
    .text('Loading...')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
    .css($text_css);
 
  // Load our sprite map image
  Crafty.load(['assets/16x16_forest_1.gif'], function(){
    // Once the image is loaded...
 
    // Define the individual sprites in the image
    // Each one (spr_tree, etc.) becomes a component
    // These components' names are prefixed with "spr_"
    //  to remind us that they simply cause the entity
    //  to be drawn with a certain sprite
    Crafty.sprite(16, 'assets/16x16_forest_1.gif', {
      spr_tree:    [0, 0],
      spr_bush:    [1, 0],
      spr_village: [0, 1],
      spr_player:  [1, 1]
    });
 
    // Now that our sprites are ready to draw, start the game
    Crafty.scene('Game');
  })
});
