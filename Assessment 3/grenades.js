var G_ANIM_IDLE = 0;
var G_ANIM_FLY = 1;

var grenades = [];
var Grenade = function() 
{
	this.sprite = new Sprite("grenade.png");
	this.sprite.buildAnimation(1, 1, 50, 60, -1, [0]);
	this.sprite.buildAnimation(4, 1, 50, 60, .18,
	[ 3, 2, 1, 0, 0, 1, 2, 3]);
	this.sprite.setAnimationOffset(0, 0, 0);
	this.sprite.setLoop(0, false);
	
	this.sprite.setAnimation(G_ANIM_FLY);
	
	this.position = new Vector2();
	this.position.set(player.position.x, player.position.y);
	this.velocity = new Vector2();
	
	this.speed = 300;
	this.rotation = player.rotation;
	
	this.hit = false;
	this.timer = 1.5;
	
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

Grenade.prototype.update = function(deltaTime) 
{
	this.sprite.update(deltaTime);
		
	this.position.x = this.position.x  +  this.velocity.x * deltaTime;
	this.position.y = this.position.y  +  this.velocity.y * deltaTime;
}

Grenade.prototype.draw = function() 
{
	context.save();
	context.translate(this.position.x- worldOffsetX, this.position.y - worldOffsetY);
	context.rotate(this.rotation);
	this.sprite.draw(context, 0,0);		
	context.restore(); 
}
