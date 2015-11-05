var ebullets2 = [];
var Ebullet2 = function(Ebul2X, Ebul2Y, Ebul2r) 
{
	this.sprite = new Sprite("tankshell.png");
	this.sprite.buildAnimation(1, 1, 17, 25, -1, [0]);
	this.sprite.setAnimationOffset(0, 0, 0);
	this.sprite.setLoop(0, false);
	
	this.position = new Vector2();
	this.position.set(Ebul2X, Ebul2Y);
	this.velocity = new Vector2();

	this.speed = 375;
	this.rotation = Ebul2r;
	this.timer = 8;
	
	var velX = 0;
	var velY = -1;
	
// now rotate this vector acording to the shooters current rotation
	var s = Math.sin(Ebul2r);
	var c = Math.cos(Ebul2r);
	var xVel = (velX * c) - (velY * s);
	var yVel = (velX * s) + (velY * c);
	this.velocity.x = xVel * this.speed;
	this.velocity.y = yVel * this.speed; 
}

var hit = false;
for(var i=0; i<ebullets2.length; i++)
{
	ebullets2[i].update(deltaTime);
}
	
Ebullet2.prototype.update = function(deltaTime) 
{
	this.sprite.update(deltaTime);
	
	if (this.timer >=0)
	{
		this.timer -= deltaTime;
	}
	
	this.position.x = this.position.x  +  this.velocity.x * deltaTime;
	this.position.y = this.position.y  +  this.velocity.y * deltaTime;
}

Ebullet2.prototype.draw = function() 
{
	context.save();
	context.translate(this.position.x- worldOffsetX, this.position.y - worldOffsetY);
	context.rotate(this.rotation);
	this.sprite.draw(context, 0,0);		
	context.restore(); 
}
