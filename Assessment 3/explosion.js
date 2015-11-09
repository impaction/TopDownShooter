var ANIM_EXPLODE = 0;

var explosions = [];
var Explosion = function(posX, posY) 
{
	this.sprite = new Sprite("explosion.png");
	this.sprite.buildAnimation(4, 5, 640, 480, .075,
	[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]);
	this.sprite.setAnimationOffset(i, -320, -240);
	this.sprite.setLoop(0, false);
	
	this.sprite.setAnimation(ANIM_EXPLODE);
	this.timer = 1.35;
	
	
	this.position = new Vector2();
	this.position.set(posX, posY);
	this.velocity = new Vector2();
	
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

Explosion.prototype.explode = function(posX, posY)
{
	var explosion = new Explosion(posX, posY); 
	explosions.push(explosion);
}
	
Explosion.prototype.update = function(deltaTime) 
{
	this.sprite.update(deltaTime);
	
	if (this.timer >= 0)
	{
		this.timer -= deltaTime;
	}
	
	if (this.timer <= 0)
	{
		explosions.splice(i, 1);
	}
	
	this.draw();
}

Explosion.prototype.draw = function() 
{
	context.save();
	context.translate(this.position.x- worldOffsetX, this.position.y - worldOffsetY);
	context.rotate(this.rotation);
	this.sprite.draw(context, 0,0);		
	context.restore(); 
}

