function Particles(img)
{
	this.particles = new Array();
	this.emitters = new Array();
	this.img = img;
	this.g = 0;
	this.lifetime = 0.4;
	this.s = 0.1;
	this.count = 0;
}

Particles.prototype.createEmitter = function(x, y, vx, vy, rate, width)
{
	var e = new Object();
	e.x = x;
	e.y = y;
	e.vx = vx;
	e.vy = vy;
	e.rate = 1.0/rate;
	e.timeTillNextEmit = e.rate
	e.active = true;
	e.width = width;
	this.emitters.push(e);
	return e;
}

Particles.prototype.addParticle = function(x, y, vx, vy)
{
	var p = new Object();
	p.x = x;
	p.y = y;
	p.vx = vx;
	p.vy = vy;
	p.lifetime = this.lifetime;
	this.particles[this.count] = p;
	this.count++;
}

Particles.prototype.update = function(dt)
{
	// Emit new particles
	for(var i = 0; i < this.emitters.length; ++i)
	{
		var e = this.emitters[i];
		if(!e.active)
			continue;

		e.timeTillNextEmit -= dt;
		if(e.timeTillNextEmit <= 0.0)
		{
			//var rx = Math.random() < 0.5 ? -1 : 1;
			//var ry = Math.random() < 0.5 ? -1 : 1;
			var r = Math.random() * Math.PI*2;
			var rx = Math.cos(r);
			var ry = Math.sin(r);
			var x = e.x + (Math.random()-0.5) * e.width;
			var y = e.y;
			this.addParticle(x, y, e.vx * rx, e.vy * ry);
			e.timeTillNextEmit += e.rate;
		}
	}

	//Move particles
	for(var i = 0; i < this.count; )
	{
		var p = this.particles[i];		
		p.vy += this.g * dt;
		p.x += dt * p.vx;
		p.y += dt * p.vy;
		p.lifetime -= dt;
		if(p.lifetime <= 0)
		{
			this.particles[i] = this.particles[this.count-1];
			this.count--;
		}
		else
		{
			++i;
		}
	}
}

Particles.prototype.draw = function(ctx)
{
	for(var i = 0; i < this.count; ++i)
	{
		var p = this.particles[i];
		ctx.save();
		ctx.translate(p.x - this.img.width*0.5*this.s, p.y - this.img.height*0.5*this.s);
		ctx.drawImage(this.img, 0, 0, this.img.width * this.s, this.img.height * this.s);
		ctx.restore();
	}
}