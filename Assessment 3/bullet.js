var bullets = [];
var Bullet = function() 
{
	this.sprite = new Sprite("bullet.png");
	this.sprite.buildAnimation(1, 1, 10, 15, -1, [0]);
	this.sprite.setAnimationOffset(0, 0, 0);
	this.sprite.setLoop(0, false);
	
	this.position = new Vector2();
	this.position.set(player.position.x, player.position.y);
	this.velocity = new Vector2();
	
	this.speed = 400;
	this.rotation = player.rotation;
	this.timer = 3;
	
	var velX = 0;
	var velY = -1;
	
// now rotate this vector acording to the players current rotation
	var s = Math.sin(player.rotation);
	var c = Math.cos(player.rotation);
	var xVel = (velX * c) - (velY * s);
	var yVel = (velX * s) + (velY * c);
	this.velocity.x = xVel * this.speed;
	this.velocity.y = yVel * this.speed; 
}

var hit = false;
for(var i=0; i<bullets.length; i++)
{
	bullets[i].update(deltaTime);
}

Bullet.prototype.update = function(deltaTime) 
{
	this.sprite.update(deltaTime);
	
	if (this.timer >=0)
	{
		this.timer -= deltaTime;
	}

	this.position.x = this.position.x  +  this.velocity.x * deltaTime;
	this.position.y = this.position.y  +  this.velocity.y * deltaTime;
}

Bullet.prototype.draw = function() 
{
	context.save();
	context.translate(this.position.x- worldOffsetX, this.position.y - worldOffsetY);
	context.rotate(this.rotation);
	this.sprite.draw(context, 12,-100);		
	context.restore(); 
}
