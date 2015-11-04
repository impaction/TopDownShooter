var ebullets = [];
var Ebullet = function(EbulX, EbulY, EbulVX, EbulVY) 
{
	this.sprite = new Sprite("ebullet.png");
	this.sprite.buildAnimation(1, 1, 10, 15, -1, [0]);
	this.sprite.setAnimationOffset(0, 0, 0);
	this.sprite.setLoop(0, false);
	
	this.position = new Vector2();
	this.position.set(EbulX, EbulY);
	this.velocity = new Vector2();
	this.velocity.set(EbulVX * 1.75, EbulVY *1.75);
	
	this.timer = 3.5;
}

var hit = false;
for(var i=0; i<ebullets.length; i++)
{
	ebullets[i].update(deltaTime);
}
	
Ebullet.prototype.update = function(deltaTime) 
{
	this.sprite.update(deltaTime);
	
	this.position.x = this.position.x  +  this.velocity.x * deltaTime;
	this.position.y = this.position.y  +  this.velocity.y * deltaTime;
}

Ebullet.prototype.draw = function() 
{
	context.save();
	context.translate(this.position.x- worldOffsetX, this.position.y - worldOffsetY);
	context.rotate(this.rotation);
	this.sprite.draw(context, 0,0);		
	context.restore(); 
}
