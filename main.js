window.onload = init;

var game = null
var canvas = null
var ctx = null;

function init()
{
	// Get the canvas
	canvas = document.getElementById('c');

	// Get the canvas context
	ctx = canvas.getContext('2d');

	// Get the audio track
	this.audio = document.getElementById('music');


	canvas.addEventListener('mousedown', onMouseDown, false);
	canvas.addEventListener('mousemove', onMouseMove, false);
	canvas.addEventListener('mouseup', onMouseUp, false);

	window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
	window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);


	//this.canvas.addEventListener('touchdown', onTouchDown, false);
	//this.canvas.addEventListener('touchmove', onTouchMove, false);
	//this.canvas.addEventListener('touchup', onTouchUp, false);


	game = new Game(canvas, ctx, this.audio);

	setInterval(run, 10);
}

function run()
{
	game.update();
	game.draw();
}


function getMousePos(evt) 
{
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}


function getTouchPos(touches, i) 
{
    var rect = canvas.getBoundingClientRect();
    return {
      x: touches[i].clientX - rect.left,
      y: touches[i].clientY - rect.top
    };
}

function onMouseDown(ev)
{

	ev.preventDefault();
	var pos = getMousePos(ev);
	game.mouseDown(pos.x, pos.y, false);
}

function onMouseMove(ev)
{
	ev.preventDefault();	
	var pos = getMousePos(ev);
	game.mouseMove(pos.x, pos.y, false)
}

function onMouseUp(ev)
{
	ev.preventDefault();
	var pos = getMousePos(ev);
	game.mouseUp(pos.x, pos.y, false);
}