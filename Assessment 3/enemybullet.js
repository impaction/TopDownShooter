var ebullets = [];
var Ebullet = function(EbulX, EbulY, Ebulr) 
{
	this.sprite = new Sprite("ebullet.png");
	this.sprite.buildAnimation(1, 1, 10, 15, -1, [0]);
	this.sprite.setAnimationOffset(0, 0, 0);
	this.sprite.setLoop(0, false);
	
	this.position = new Vector2();
	this.position.set(EbulX, EbulY);
	this.velocity = new Vector2();
	
	this.speed = 325;
	this.rotation = Ebulr;
	this.timer = 3.5;
	
	var velX = 0;
	var velY = -1;
	
// now rotate this vector acording to the shooters current rotation
	var s = Math.sin(Ebulr);
	var c = Math.cos(Ebulr);
	var xVel = (velX * c) - (velY * s);
	var yVel = (velX * s) + (velY * c);
	this.velocity.x = xVel * this.speed;
	this.velocity.y = yVel * this.speed; 
}

var hit = false;
for(var i=0; i<ebullets.length; i++)
{
	ebullets[i].update(deltaTime);
}
	
Ebullet.prototype.update = function(deltaTime) 
{
	this.sprite.update(deltaTime);
	
	if (this.timer >=0)
	{
		this.timer -= deltaTime;
	}
	
	this.position.x = this.position.x  +  this.velocity.x * deltaTime;
	this.position.y = this.position.y  +  this.velocity.y * deltaTime;
}

Ebullet.prototype.draw = function() 
{
	context.save();
	context.translate(this.position.x- worldOffsetX, this.position.y - worldOffsetY);
	context.rotate(this.rotation);
	this.sprite.draw(context, -12,-100);		
	context.restore(); 
}
