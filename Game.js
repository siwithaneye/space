var g;
var speed = 0;
var mouseX = 0;
var mouseY = 0;
var ship = null;
var background = null;

function Game(canvas, ctx, audio)
{
	this.timer = new Timer();
	
	this.items = [];
	this.beams = [];
	this.images = [];
	this.updateList = []; 
	this.drawList = [];
	this.frames = [];
	this.canvas = canvas;
	this.ctx = ctx;
	this.ctx.font = '40px Calibri';
	this.audio = document.getElementById('music');	
	this.prevMouseX = 0;
	this.loadResources();

	g = this;

	background = new GameObject(this.images[0]);
	background.setPos(this.canvas.width*0.5, this.canvas.height*0.5);
	this.drawList.push(background);

	ship = new Ship(this.images[1]);
	ship.setPos(100, 100);
	ship.s = 0.1;
	this.updateList.push(ship);
	this.drawList.push(ship)
}

Game.prototype.onBeat = function(beat) 
{	
	
};

Game.prototype.update = function()
{

	this.timer.update();
	var dt = this.timer.getDeltaTime();

	if(Key.isDown(Key.UP)) ship.thrust = 350;
	else  ship.thrust = 0;

	if(Key.isDown(Key.LEFT)) ship.vr = -3.5;

	if(Key.isDown(Key.RIGHT)) ship.vr = 3.5;

	if(Key.isDown(Key.SPACE)) this.fireBullet(ship.x, ship.y, Math.sin(ship.r) * 1000, -Math.cos(ship.r) * 1000);

	for(var i = 0; i < this.updateList.length; ++i)
	{
		this.updateList[i].update(dt);
	}
}


Game.prototype.draw = function()
{
	for(var i = 0; i < this.drawList.length; ++i)
	{
		this.drawList[i].draw(this.ctx);
	}
	
}

Game.prototype.fireBullet = function(x, y, vx, vy) {
	
	bullet = new GameObject(this.images[2]);
	bullet.setPos(x, y);
	bullet.vx = vx;
	bullet.vy = vy;
	this.updateList.push(bullet);
	this.drawList.push(bullet);
}

Game.prototype.mouseDown = function(x, y, isTouch)
{
	ship.thrust = 100;
}

Game.prototype.mouseMove = function(x, y, isTouch)
{
	

}

Game.prototype.mouseUp = function(x, y, isTouch)
{
	ship.thrust = 0;
}

Game.prototype.imgLoaded = function(i)
{	
	console.log("Loaded:" + i + "/" + this.images.length)
	if(i == this.images.length)
	{
		console.log('Game starting...');		
	}
}

Game.prototype.loadResources = function()
{
	var imageSrcs = [	
	"assets/spacebg2.png",	//0
	"assets/spaceship2.png",	//1
	"assets/greenbullet.png",	//2
	];

	this.images = new Array(imageSrcs.length);

	for(var i = 0; i < imageSrcs.length; ++i)
	{
		var img = new Image();		
		img.onload = this.imgLoaded(i+1);
		img.src = imageSrcs[i];
		this.images[i] = img;
	}

	
}