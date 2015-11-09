//enemy animation variables
var ANIM_WALKING = 0;
var ANIM_IDLE = 1;
var ANIM_MAX = 2;

var Enemy = function(x, y) 
{  
	this.sprite = new Sprite("soldier.png");
 
	this.sprite.buildAnimation(3, 3, 151, 151, 0.2,  //walking
	[3, 4, 5, 4]);
	this.sprite.buildAnimation(3, 3, 151, 151, 0.2,  // idle
	[4]);
	
	for(var i=0; i<ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, -75, -75);								
	}
	this.sprite.setAnimation(ANIM_IDLE);
	
	this.position = new Vector2();
	this.position.set(x,y);
	this.velocity = new Vector2();

	this.rotation = 0;
	this.speed = 100;

//default directions	
	this.whichWay = 0;
	this.pauseTimer = 0;
	this.pause = 0;
	this.randomDirectionTimer = 1;
	
// aggro player
	this.agro = false;
	this.shootcd = 1.5;
}

Enemy.prototype.shoot = function(EbulX, EbulY, Ebulr)
{
	var ebullet = new Ebullet(EbulX, EbulY, Ebulr); 
	ebullets.push(ebullet);
	sfxEGunFire.play();
}

Enemy.prototype.randomDirection = function()
{
	this.moveUp = false;
	this.moveDown = false
	this.moveLeft = false;
	this.moveRight = false;
	
	this.whichWay = Math.floor(Math.random() * 4) + 1 ; 		// max, min random time
	this.pauseTimer = Math.floor(Math.random() * 2) + 1 ;		// max, min random time
	
	if (this.whichWay == 1)
	{
		this.moveUp = true; //0
	}
	if (this.whichWay == 4)
	{
		this.moveRight = true; //1.5
	}
	if (this.whichWay == 2)
	{
		this.moveDown = true; //3
	}
	if (this.whichWay == 3)
	{
		this.moveLeft = true; //4.5
	}
}

Enemy.prototype.distanceToPlayer = function(x1,y1,x2,y2)
{
	x3 = x1 - x2;
	y3 = y1 - y2;
	
	this.distanceOfPlayer = Math.sqrt(x3 * x3 + y3 * y3);
}

Enemy.prototype.targetPlayer = function(x1, y1, x2, y2)
{ 
	x3 = x1 - x2;
	y3 = y1 - y2;
	
	this.rotation = Math.atan2 (y3, x3) - Math.PI * 0.5;
}

Enemy.prototype.updateWonder = function(deltaTime) 
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
	var speed = 100;
	var ddx = 0;
	var ddy = 0;
	
// if moving		
	if(this.moveUp == true)
	{
		this.rotation = 0;
		ddy = ddy - speed;    // enemy wants to go up 
	}
	
	if(this.moveRight == true)
	{
		this.rotation = 1.55;
		ddx = ddx + speed;   // enemy wants to go right
	}
		
	if(this.moveDown == true)
	{
		this.rotation = 3.1;
		ddy = ddy + speed;    // enemy wants to go down
	}
		
	if(this.moveLeft == true)
	{
		this.rotation = 4.65;
		ddx = ddx - speed;   // enemy wants to go left
	}
	
//walking animation
	if (this.velocity.x > 2 || this.velocity.y > 2 || this.velocity.x < -2 || this.velocity.y < -2)
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
	
//pause
	if (this.pause > 0)
	{
		this.moveUp = false;
		this.moveDown = false
		this.moveLeft = false;
		this.moveRight = false;22
	}	

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

Enemy.prototype.updateAgro = function(deltaTime)
{
	this.sprite.update(deltaTime);
	
	this.targetPlayer (this.position.x, this.position.y, player.position.x, player.position.y);	

//speeds acceleration		
	var speed = 100;
	var ddx = 0;
	var ddy = 0;
	
// go toward player	
//up
	if (this.position.y > player.position.y + 64)
	{
		ddy = -speed;
	}
//down	
	if (this.position.y < player.position.y - 64)
	{
		ddy = speed;
	}
//left
	if (this.position.x > player.position.x + 64)
	{
		ddx = -speed;
	}
//right	
	if (this.position.x < player.position.x - 64)
	{
		ddx = speed;
	}
	
	if (this.shootcd >=0)
	{
		this.shootcd -= deltaTime;
	}
	
	if (this.shootcd <= 0)
	{
		this.shoot(this.position.x, this.position.y, this.rotation);
		this.shootcd = 1.5;
	}	
	
//walking animation
	if (this.velocity.x > 50 || this.velocity.y > 50 || this.velocity.x < -50 || this.velocity.y < -50)
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

Enemy.prototype.update = function(deltaTime)
{
	this.distanceToPlayer(this.position.x, this.position.y, player.position.x, player.position.y);
	if (this.distanceOfPlayer <= 450)
	{
		this.updateAgro(deltaTime);
	}
	else
	{
		this.updateWonder(deltaTime);
	}
	this.draw();
}

Enemy.prototype.draw = function()
{
	context.save();
	context.translate(this.position.x- worldOffsetX, this.position.y - worldOffsetY);
	context.rotate(this.rotation);
	this.sprite.draw(context, 0,0);		
	context.restore(); 						  
}