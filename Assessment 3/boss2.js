//Boss animation variables
var ANIM_IDLE = 0;
var ANIM_MAX = 1;
<<<<<<< HEAD
var Boss2 = function(b2x, b2y) 
{  
	this.sprite = new Sprite("TigerTank.png");
 
	this.sprite.buildAnimation(1, 1, 269, 580, -1,  //walking
=======
var Boss2 = function(x, y) 
{  
	this.sprite = new Sprite("TigerTank.png");
 
	this.sprite.buildAnimation(1, 1, 580, 269, -1,  //walking
>>>>>>> origin/master
	[0]);
	
	for(var i=0; i<ANIM_MAX; i++)
	{
<<<<<<< HEAD
		this.sprite.setAnimationOffset(i, -130, -290);								
=======
		this.sprite.setAnimationOffset(i, 0, 0);								
>>>>>>> origin/master
	}
	this.sprite.setAnimation(ANIM_IDLE);

	this.position = new Vector2();
<<<<<<< HEAD
	this.position.set(b2x, b2y);
=======
	this.position.set(1100, 1500);
>>>>>>> origin/master
	this.velocity = new Vector2();
	this.rotation = 0;
	this.speed = 50;
	
//default directions	
	this.whichWay = 0;
	this.pauseTimer = 0;
	this.pause = 0;
	this.randomDirectionTimer = 1;
	
// aggro player
	this.agro = false;
	
//default stats
<<<<<<< HEAD
	this.health = 500;
	this.shootcd = .75;
}

Boss2.prototype.spawn = function(b2x, b2y)
{
	var boss2 = new Boss2(b2x, b2y); 
	bosses.push(boss2);
}

Boss2.prototype.shoot = function(Ebul2X, Ebul2Y, Ebul2r)
{
	var ebullet2 = new Ebullet2(Ebul2X, Ebul2Y, Ebul2r); 
	ebullets2.push(ebullet2);
=======
	this.health = 250;
	this.shootcd = .5;
}

Boss2.prototype.spawn = function()
{
	var boss = new Boss2(); 
	bosses.push(boss2);
}

Boss2.prototype.shoot = function(EbulX, EbulY, EbulVX, EbulVY)
{
	var ebullet = new Ebullet(EbulX, EbulY, EbulVX, EbulVY); 
	ebullets.push(ebullet);
>>>>>>> origin/master
}

Boss2.prototype.randomDirection = function()
{
	this.moveUp = false;
	this.moveDown = false
	this.moveLeft = false;
	this.moveRight = false;
	
	this.whichWay = Math.floor(Math.random() * 4) + 1 ; 		// max, min random time
	this.pauseTimer = Math.floor(Math.random() * 2) + 1 ;		// max, min random time
	
	if (this.whichWay == 1)
	{
		this.moveUp = true;
	}
	if (this.whichWay == 2)
	{
		this.moveDown = true;
	}
	if (this.whichWay == 3)
	{
		this.moveLeft = true;
	}
	if (this.whichWay == 4)
	{
		this.moveRight = true;
	}
}

Boss2.prototype.distanceToPlayer = function(x1,y1,x2,y2)
{
	x3 = x1 - x2;
	y3 = y1 - y2;
	
	this.distanceOfPlayer = Math.sqrt(x3 * x3 + y3 * y3);
}

Boss2.prototype.targetPlayer = function(x1, y1, x2, y2)
{ 
	x3 = x1 - x2;
	y3 = y1 - y2;
	
<<<<<<< HEAD
	this.rotation = Math.atan2 (y3, x3) - Math.PI * 0.5;
=======
	this.rotation = Math.atan2 (y3, x3);
>>>>>>> origin/master
}

Boss2.prototype.updateWonder = function(deltaTime) 
{
	this.sprite.update(deltaTime);
//random direction on a timer
	this.randomDirectionTimer -= deltaTime;
	if (this.randomDirectionTimer <= 0)
	{
		this.randomDirection();
		this.randomDirectionTimer = Math.floor((Math.random() * 4) + .5);	// max, min random time
	}
	
//randomly pause every so often 	
	this.pauseTimer -= deltaTime;
	if (this.pauseTimer <= 0)
	{
		this.pause = Math.floor((Math.random() * 2) + .5); 				// max, min random time
		this.pauseTimer = Math.floor((Math.random() * 3) + 1); ;		// max, min random time
	}
	
//randomly pause length of time	
	this.pause -= deltaTime;
	if (this.pause <= 0)
	{
		this.pause = 0;
	}
		
//speeds acceleration		
	var ddx = 0;
	var ddy = 0;
	
// if moving		
	if(this.moveUp == true)
	{
		this.rotation = 0;
		ddy = ddy - this.speed;    // enemy wants to go up 
	}
	
	if(this.moveRight == true)
	{
		this.rotation = 1.5;
		ddx = ddx + this.speed;   // enemy wants to go right
	}
		
	if(this.moveDown == true)
	{
		this.rotation = 3;
		ddy = ddy + this.speed;    // enemy wants to go down
	}
		
	if(this.moveLeft == true)
	{
		this.rotation = 4.5
		ddx = ddx - this.speed;   // enemy wants to go left
	}
	
//update position and velocity		
	this.velocity.x = ddx;     
	this.velocity.y = ddy;
	this.position.y = this.position.y + this.velocity.y * deltaTime;     
	this.position.x = this.position.x + this.velocity.x * deltaTime;

//pause
	if (this.pause > 0)
	{
		this.moveUp = false;
		this.moveDown = false
		this.moveLeft = false;
		this.moveRight = false;
	}
	
//collision detection
	var tx = pixelToTile(this.position.x);  
	var ty = pixelToTile(this.position.y);  
	var nx = (this.position.x)%TILE;         // true if enemy overlaps right  
	var ny = (this.position.y)%TILE;         // true if enemy overlaps below  
	
//collision with walls
	var Wcell = cellAtTileCoord(LAYER_WALLS, tx, ty);  
	var Wcellright = cellAtTileCoord(LAYER_WALLS, tx + 1, ty);  
	var Wcelldown = cellAtTileCoord(LAYER_WALLS, tx, ty + 2);  
	var Wcelldiag = cellAtTileCoord(LAYER_WALLS, tx + 1, ty + 2);
	
//collision with lava
	var Lcell = cellAtTileCoord(LAYER_LAVA, tx, ty);  
	var Lcellright = cellAtTileCoord(LAYER_LAVA, tx + 1, ty);  
	var Lcelldown = cellAtTileCoord(LAYER_LAVA, tx, ty + 2);  
	var Lcelldiag = cellAtTileCoord(LAYER_LAVA, tx + 1, ty + 2);
	
// what happens when the enemy is colliding with the wall        
	if (this.velocity.y > 0)  
	{  
		if ((Wcelldown && !Wcell) || (Wcelldiag && !Wcellright && nx))  
		{   // clamp the y position to avoid moving into the tile we just hit     
			this.position.y = tileToPixel(ty);            
			this.velocity.y = 0;              // stop downward velocity         
			ny = 0;                           // no longer overlaps the cells below 
// reverse direction
			this.moveDown = false;
			this.pause = .5;
			this.moveUp = true;
		}     
	}
	else if (this.velocity.y < 0)  
	{  
		if ((Wcell && !Wcelldown) || (Wcellright && !Wcelldiag && nx))  
		{   // clamp the y position to avoid moving into the tile we just hit     
			this.position.y = tileToPixel(ty + 1);          
			this.velocity.y = 0;             // stop upward velocity     
// player is no longer really in that cell, we clamped them to the cell below       
			Wcell = Wcelldown;                         
			Wcellright = Wcelldiag;          // (ditto)      
			ny = 0;                        // player no longer overlaps the cells below   		         
// reverse direction
			this.moveUp = false;
			this.pause = .5;
			this.moveDown = true;
		}
	}

	if (this.velocity.x > 0) 
	{       
		if ((Wcellright && !Wcell) || (Wcelldiag  && !Wcelldown && ny))  
		{  // clamp the x position to avoid moving into the tile we just hit      
			this.position.x = tileToPixel(tx);         
			this.velocity.x = 0;      // stop horizontal velocity 
// reverse direction
			this.moveRight = false;
			this.pause = .5;
			this.moveLeft = true;
		}  
	} 
	else if (this.velocity.x < 0) 
	{         
		if ((Wcell && !Wcellright) || (Wcelldown && !Wcelldiag && ny))  
		{  // clamp the x position to avoid moving into the tile we just hit     
			this.position.x = tileToPixel(tx + 1);         
			this.velocity.x = 0;        // stop horizontal velocity   
// reverse direction
			this.moveLeft = false;
			this.pause = .5;
			this.moveRight = true;
		} 
	}
	
// what happens when the enemy is colliding with the lava
	if (this.velocity.y > 0)  
	{  
		if ((Lcelldown && !Lcell) || (Lcelldiag && !Lcellright && nx))  
		{   // clamp the y position to avoid moving into the tile we just hit      
			this.position.y = tileToPixel(ty);            
			this.velocity.y = 0;              // stop downward velocity         
			ny = 0;                           // no longer overlaps the cells below 
// reverse direction
			this.moveDown = false;
			this.pause = .5;
			this.moveUp = true;
		}     
	}
	else if (this.velocity.y < 0)  
	{  
		if ((Lcell && !Lcelldown) || (Lcellright && !Lcelldiag && nx))  
		{   // clamp the y position to avoid moving into the tile we just hit      
			this.position.y = tileToPixel(ty + 1);          
			this.velocity.y = 0;             // stop upward velocity     
// player is no longer really in that cell, we clamped them to the cell below       
			Lcell = Lcelldown;                         
			Lcellright = Lcelldiag;          // (ditto)      
			ny = 0;                        // player no longer overlaps the cells below   		         
// reverse direction
			this.moveUp = false;
			this.pause = .5;
			this.moveDown = true;
		}
	}

	if (this.velocity.x > 0) 
	{       
		if ((Lcellright && !Lcell) || (Lcelldiag  && !Lcelldown && ny))  
		{  // clamp the x position to avoid moving into the tile we just hit       
			this.position.x = tileToPixel(tx);         
			this.velocity.x = 0;      // stop horizontal velocity 
// reverse direction
			this.moveRight = false;
			this.pause = .5;
			this.moveLeft = true;
		}  
	} 
	else if (this.velocity.x < 0) 
	{         
		if ((Lcell && !Lcellright) || (Lcelldown && !Lcelldiag && ny))  
		{  // clamp the x position to avoid moving into the tile we just hit    
			this.position.x = tileToPixel(tx + 1);         
			this.velocity.x = 0;        // stop horizontal velocity   
// reverse direction
			this.moveLeft = false;
			this.pause = .5;
			this.moveRight = true;
		} 
	}
}

Boss2.prototype.updateAgro = function(deltaTime)
{
	this.sprite.update(deltaTime);
	
<<<<<<< HEAD
this.targetPlayer (this.position.x, this.position.y, player.position.x, player.position.y);	
=======
//this.targetPlayer (this.position.x, this.position.y, player.position.x, player.position.y);	
>>>>>>> origin/master
	
//speeds acceleration		
	var ddx = 0;
	var ddy = 0;
	
// go toward player	
//up
<<<<<<< HEAD
	if (this.position.y > player.position.y + 288)
=======
	if (this.position.y > player.position.y + 2)
>>>>>>> origin/master
	{
		ddy = - this.speed;
	}
//down	
<<<<<<< HEAD
	if (this.position.y < player.position.y - 288)
=======
	if (this.position.y < player.position.y - 2)
>>>>>>> origin/master
	{
		ddy = this.speed;
	}
//left
<<<<<<< HEAD
	if (this.position.x > player.position.x + 288)
=======
	if (this.position.x > player.position.x + 2)
>>>>>>> origin/master
	{
		ddx = - this.speed;
	}
//right	
<<<<<<< HEAD
	if (this.position.x < player.position.x - 288)
=======
	if (this.position.x < player.position.x - 2)
>>>>>>> origin/master
	{
		ddx =  this.speed;
	}
	
	if (this.shootcd >=0)
	{
		this.shootcd -= deltaTime;
	}
	
	if (this.shootcd <= 0)
	{
<<<<<<< HEAD
		this.shoot(this.position.x, this.position.y, this.rotation);
		this.shootcd = .75;
	}	
=======
		enemy.shoot(this.position.x, this.position.y, this.velocity.x, this.velocity.y);
		this.shootcd = .75;
	}	
	
//walking animation
	if (this.velocity.x > 1 || this.velocity.y > 1 || this.velocity.x < -1 || this.velocity.y < -1)
	{
		if (this.sprite.currentAnimation != ANIM_WALKING)
		{
			this.sprite.setAnimation(ANIM_WALKING);
		}
	}
	else
	{
		this.sprite.setAnimation(ANIM_IDLE);
	}
>>>>>>> origin/master

//update position and velocity		
	this.velocity.x = ddx;     
	this.velocity.y = ddy;
	this.position.y = this.position.y + this.velocity.y * deltaTime;     
	this.position.x = this.position.x + this.velocity.x * deltaTime;
	
//collision detection
	var tx = pixelToTile(this.position.x);  
	var ty = pixelToTile(this.position.y);  
	var nx = (this.position.x)%TILE;         // true if enemy overlaps right  
	var ny = (this.position.y)%TILE;         // true if enemy overlaps below  
	
//collision with walls
	var Wcell = cellAtTileCoord(LAYER_WALLS, tx, ty);  
	var Wcellright = cellAtTileCoord(LAYER_WALLS, tx + 1, ty);  
	var Wcelldown = cellAtTileCoord(LAYER_WALLS, tx, ty + 2);  
	var Wcelldiag = cellAtTileCoord(LAYER_WALLS, tx + 1, ty + 2);
	
//collision with lava
	var Lcell = cellAtTileCoord(LAYER_LAVA, tx, ty);  
	var Lcellright = cellAtTileCoord(LAYER_LAVA, tx + 1, ty);  
	var Lcelldown = cellAtTileCoord(LAYER_LAVA, tx, ty + 2);  
	var Lcelldiag = cellAtTileCoord(LAYER_LAVA, tx + 1, ty + 2);
	
// what happens when the enemy is colliding with the wall        
	if (this.velocity.y > 0)  
	{  
		if ((Wcelldown && !Wcell) || (Wcelldiag && !Wcellright && nx))  
		{   // clamp the y position to avoid moving into the tile we just hit     
			this.position.y = tileToPixel(ty);            
			this.velocity.y = 0;              // stop downward velocity         
			ny = 0;                           // no longer overlaps the cells below 
		}     
	}
	else if (this.velocity.y < 0)  
	{  
		if ((Wcell && !Wcelldown) || (Wcellright && !Wcelldiag && nx))  
		{   // clamp the y position to avoid moving into the tile we just hit     
			this.position.y = tileToPixel(ty +1);          
			this.velocity.y = 0;             // stop upward velocity     
// player is no longer really in that cell, we clamped them to the cell below       
			Wcell = Wcelldown;                         
			Wcellright = Wcelldiag;          // (ditto)      
			ny = 0;                        // player no longer overlaps the cells below   		         
		}
	}

	if (this.velocity.x > 0) 
	{       
		if ((Wcellright && !Wcell) || (Wcelldiag  && !Wcelldown && ny))  
		{  // clamp the x position to avoid moving into the tile we just hit      
			this.position.x = tileToPixel(tx);         
			this.velocity.x = 0;      // stop horizontal velocity 
		}  
	} 
	else if (this.velocity.x < 0) 
	{         
		if ((Wcell && !Wcellright) || (Wcelldown && !Wcelldiag && ny))  
		{  // clamp the x position to avoid moving into the tile we just hit     
			this.position.x = tileToPixel(tx +1);         
			this.velocity.x = 0;        // stop horizontal velocity   
		} 
	}
	
// what happens when the enemy is colliding with the lava
	if (this.velocity.y > 0)  
	{  
		if ((Lcelldown && !Lcell) || (Lcelldiag && !Lcellright && nx))  
		{   // clamp the y position to avoid moving into the tile we just hit      
			this.position.y = tileToPixel(ty);            
			this.velocity.y = 0;              // stop downward velocity         
			ny = 0;                           // no longer overlaps the cells below 
		}     
	}
	else if (this.velocity.y < 0)  
	{  
		if ((Lcell && !Lcelldown) || (Lcellright && !Lcelldiag && nx))  
		{   // clamp the y position to avoid moving into the tile we just hit      
			this.position.y = tileToPixel(ty +1);          
			this.velocity.y = 0;             // stop upward velocity     
// player is no longer really in that cell, we clamped them to the cell below       
			Lcell = Lcelldown;                         
			Lcellright = Lcelldiag;          // (ditto)      
			ny = 0;                        // player no longer overlaps the cells below   		         
		}
	}

	if (this.velocity.x > 0) 
	{       
		if ((Lcellright && !Lcell) || (Lcelldiag  && !Lcelldown && ny))  
		{  // clamp the x position to avoid moving into the tile we just hit       
			this.position.x = tileToPixel(tx);         
			this.velocity.x = 0;      // stop horizontal velocity 
		}  
	} 
	else if (this.velocity.x < 0) 
	{         
		if ((Lcell && !Lcellright) || (Lcelldown && !Lcelldiag && ny))  
		{  // clamp the x position to avoid moving into the tile we just hit    
			this.position.x = tileToPixel(tx +1);         
			this.velocity.x = 0;        // stop horizontal velocity   
		} 
	}
}

Boss2.prototype.update = function(deltaTime)
{
	if (this.health <=0)
	{
		bosses.splice(i, 1);
	}
	
	this.distanceToPlayer(this.position.x, this.position.y, player.position.x, player.position.y);
	if (this.distanceOfPlayer <= 1500)
	{
		this.updateAgro(deltaTime);
	}
	else
	{
		this.updateWonder(deltaTime);
	}
	this.draw();
}

Boss2.prototype.draw = function()
{
	context.save();
	context.translate(this.position.x- worldOffsetX, this.position.y - worldOffsetY);
	context.rotate(this.rotation);
	this.sprite.draw(context, 0,0);		
	context.restore(); 	
}