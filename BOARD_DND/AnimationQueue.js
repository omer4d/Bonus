function Animation(x0, y0, x1, y1, onDraw, onStart, onFinish)
{
	this.x0 = x0;
	this.y0 = y0;
	this.x1 = x1;
	this.y1 = y1;
	this.onDraw = onDraw;
	this.onStart = onStart;
	this.onFinish = onFinish;
	
	this.x = x0;
	this.y = y0;
	this.progress = 0;
}

Animation.prototype.tick = function(speed)
{
	if(this.progress == 0 && this.onStart !== undefined)
		this.onStart();
		
	this.x += (this.x1 - this.x0) * speed;
	this.y += (this.y1 - this.y0) * speed;
	this.progress += speed;
	
	if(this.progress >= 1.0)
	{
		if(this.onFinish !== undefined)
			this.onFinish();
		return false;
	}
	
	else
		return true;
}

Animation.prototype.draw = function()
{
	this.onDraw(this.x, this.y);
}

function AnimationQueue(speed, onFinish)
{
	this.queue = new Array();
	this.onFinish = onFinish;
	this.speed = speed;
}

AnimationQueue.prototype.add = function(animation)
{
	this.queue.push(animation);
}

AnimationQueue.prototype.tick = function()
{
	var queue = this.queue;

	if(queue.length > 0)
	{
		if(!queue[0].tick(this.speed))
		{
			queue.shift();
		}
	}
	
	else
	{
		this.play = false;
		if(this.onFinish !== undefined)
			this.onFinish();
	}
}

AnimationQueue.prototype.draw = function()
{
	if(this.queue.length > 0)
	{
		this.queue[0].draw();
	}
}