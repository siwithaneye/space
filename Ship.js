function Ship(image)
{
	this.x = 0;
	this.y = 0;
	this.r = 0;
	this.vx = 0;
	this.vy = 0;
	this.vr = 0;
	this.s = 1;	
	this.thrust = 0;
	this.rdamp = 0.94;
	this.damp = 0.99;
	this.alpha = 1;
	this.blend = "source-over";
	this.img = image;
	this.width = image.width;
	this.height = image.height;
}

Ship.prototype.setPos = function(x, y)
{
	this.x = x;
	this.y = y;
}

Ship.prototype.getPos = function()
{
	var o = new Object();
	o.x = this.x;
	o.y = this.y;
	return o;
}

Ship.prototype.setVel = function(vx, vy)
{
	this.vx = vx;
	this.vy = vy;
}

Ship.prototype.getVel = function()
{
	var o = new Object();
	o.x = this.vx;
	o.y = this.y;
	return o;
}

Ship.prototype.update = function(dt)
{	
	this.r += this.vr * dt;

	this.vx += Math.sin(this.r) * this.thrust * dt;
	this.vy += -Math.cos(this.r) * this.thrust * dt;

	this.x += this.vx * dt;
	this.y += this.vy * dt;

	this.vx *= this.damp;
	this.vy *= this.damp;
	this.vr *= this.rdamp;
}

Ship.prototype.draw = function(ctx)
{
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.rotate(this.r);
	ctx.scale(this.s, this.s);
	ctx.globalAlpha = this.alpha;
	//ctx.globalCompositeOperation = this.blend;
	ctx.drawImage(this.img, -this.width*0.5, -this.height*0.5);
	ctx.restore();		
}

Ship.prototype.intersects = function(x, y)
{
	var dx = Math.abs(this.x-x);
	var dy = Math.abs(this.y-y);
	return (dx < this.width*0.5*this.s) && (dy < this.height*0.5*this.s);
}