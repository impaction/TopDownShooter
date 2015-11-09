//player animation variables
var ANIM_WALKING = 0;
var ANIM_IDLE = 1;
var ANIM_MAX = 2;

var Player = function() 
{  
	this.sprite = new Sprite("soldier.png");
 
	this.sprite.buildAnimation(3, 3, 151, 151, 0.2,  //walking
	[0, 1, 2, 1]);
	this.sprite.buildAnimation(3, 3, 151, 151, 0.2,  // idle
	[1]);

	for(var i=0; i<ANIM_MAX; i++)					
	{
		this.sprite.setAnimationOffset(i, -75, -75);								
	}
	
	this.sprite.setAnimation(ANIM_IDLE);
	
	this.position = new Vector2();  
	this.position.set( 2*TILE, 2*TILE);
	
	this.velocity = new Vector2();
    
	this.width = 151;  
	this.height = 151; 
    
	this.directionX = 0;
	this.directionY = 0;
	this.rotation = 0;	
	
	this.xspeed = 0;
	this.yspeed = 0;
	this.speed = 250;
	this.turnspeed = 8;
	
	this.shooting = false;
	this.throwing = false;
	this.shootCooldownTimer = 0;
	this.throwCoolDownTimer = 0;
//health
	this.health = 100;
	this.score = 0;
}; 
	
Player.prototype.shoot = function()
{
	var bullet = new Bullet(); 
	bullets.push(bullet);
}

Player.prototype.throwG = function()
{
	var grenade = new Grenade(); 
	grenades.push(grenade);
}

Player.prototype.update = function(deltaTime)
{
	if (this.health <= 0)
	{
		musicBackgroundL1.stop();
		musicBackgroundL2.stop();
		musicBackgroundL3.stop();
		musicBackgroundGO.play();
		gameState = STATE_GAMEOVER;
	}
	
//update sprite
	this.sprite.update(deltaTime);

	this.shooting = false;
	this.throwing = false;
	
	this.angularDirection = 0;
	this.directionX = 0;
	this.directionY = 0;
		
	if (this.shootCooldownTimer >= 0)
	{ 			
		this.shootCooldownTimer -= deltaTime;
	}
	
	if (this.throwCoolDownTimer >= 0)
	{
		this.throwCoolDownTimer -= deltaTime;
	}
	
//shoot bullet ,animation 
	if(keyboard.isKeyDown(keyboard.KEY_NUMPAD_1) == true && this.shootCooldownTimer <= 0) 
	{
		sfxGunFire.play();
		this.shooting = true;
		this.shootCooldownTimer += .4;
		this.shoot();
	}
	
//throw grenade ,animation 
	if(keyboard.isKeyDown(keyboard.KEY_NUMPAD_2) == true && this.throwCoolDownTimer <= 0)
	{
		//sfxFire.play();
		this.throwing = true;
		this.throwCoolDownTimer += 5;
		this.throwG();
	}
	
// rotate left   
	if(keyboard.isKeyDown(keyboard.KEY_A) == true) 
	{
		this.angularDirection =- 1;		
	}
//rotate right
	else if(keyboard.isKeyDown(keyboard.KEY_D) == true) 
	{
		this.angularDirection =+ 1;
	} 

//move forward
	if (keyboard.isKeyDown(keyboard.KEY_W) == true)  
	{         
		this.directionY =- 1;
	}
//move backward
	else if(keyboard.isKeyDown(keyboard.KEY_S) == true)  
	{         
		this.directionY =+ 1;
	}
// scarf  left   
	else if(keyboard.isKeyDown(keyboard.KEY_Q) == true) 
	{
		this.directionX =-1;
	}
// scarf  right   
	else if(keyboard.isKeyDown(keyboard.KEY_E) == true) 
	{
		this.directionX =+ 1;
	}
	
//walking
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

	var s = Math.sin(this.rotation);  
	var c = Math.cos(this.rotation); 
	this.xDir = (this.directionX * c) - (this.directionY * s);  
	this.yDir = (this.directionX * s) + (this.directionY * c);  
	this.velocity.x = this.xDir * this.speed * deltaTime;  
	this.velocity.y = this.yDir * this.speed * deltaTime;

	this.position.x += this.velocity.x;           
	this.position.y += this.velocity.y;
	this.rotation += this.angularDirection * this.turnspeed * deltaTime;  

//collision with walls
	var tx = pixelToTile(this.position.x);  
	var ty = pixelToTile(this.position.y);  
	var nx = (this.position.x)%TILE;         // true if player overlaps right  
	var ny = (this.position.y)%TILE;         // true if player overlaps below  
	
	var cell = cellAtTileCoord(LAYER_WALLS, tx, ty);  
	var cellright = cellAtTileCoord(LAYER_WALLS, tx + 1, ty);  
	var celldown = cellAtTileCoord(LAYER_WALLS, tx, ty + 2);  
	var celldiag = cellAtTileCoord(LAYER_WALLS, tx + 1, ty + 2);
	
// what happens when the player is colliding with the wall        
	if (this.velocity.y > 0)  
	{  
		if ((celldown && !cell) || (celldiag && !cellright && nx))  
		{   // clamp the y position to avoid falling into platform below     
			this.position.y = tileToPixel(ty);            
			this.velocity.y = 0;              // stop downward velocity         
			ny = 0;                           // no longer overlaps the cells below  
		}     
	}
	else if (this.velocity.y < 0)  
	{  
		if ((cell && !celldown) || (cellright && !celldiag && nx))  
		{   // clamp the y position to avoid jumping into platform above      
			this.position.y = tileToPixel(ty + 1);          
			this.velocity.y = 0;             // stop upward velocity     
// player is no longer really in that cell, we clamped them to the cell below       
			cell = celldown;                         
			cellright = celldiag;          // (ditto)      
			ny = 0;                        // player no longer overlaps the cells below   
		}         
	}
    
	if (this.velocity.x > 0) 
	{       
		if ((cellright && !cell) || (celldiag  && !celldown && ny))  
		{  // clamp the x position to avoid moving into the platform we just hit      
			this.position.x = tileToPixel(tx);         
			this.velocity.x = 0;      // stop horizontal velocity       
		}  
	} 
	else if (this.velocity.x < 0) 
	{         
		if ((cell && !cellright) || (celldown && !celldiag && ny))  
		{  // clamp the x position to avoid moving into the platform we just hit    
			this.position.x = tileToPixel(tx + 1);         
			this.velocity.x = 0;        // stop horizontal velocity      
		} 
	 }
//collision with lava
	var Lcell = cellAtTileCoord(LAYER_LAVA, tx, ty);  
	var Lcellright = cellAtTileCoord(LAYER_LAVA, tx + 1, ty);  
	var Lcelldown = cellAtTileCoord(LAYER_LAVA, tx, ty + 1);  
	var Lcelldiag = cellAtTileCoord(LAYER_LAVA, tx + 1, ty + 1);
	
// what happens when the player is colliding with the lava
	if (this.velocity.y > 0)  
	{  
		if ((Lcelldown && !Lcell) || (Lcelldiag && !Lcellright && nx))  
		{   // clamp the y position to avoid moving into the tile we just hit      
			this.position.y = this.position.y - 8; //tileToPixel(ty);            
			this.velocity.y = 0;              // stop downward velocity         
			ny = 0;                           // no longer overlaps the cells below
			this.health -= 1;
		}     
	}
	else if (this.velocity.y < 0)  
	{  
		if ((Lcell && !Lcelldown) || (Lcellright && !Lcelldiag && nx))  
		{   // clamp the y position to avoid moving into the tile we just hit      
			this.position.y = this.position.y +8; //tileToPixel(ty +1);          
			this.velocity.y = 0;             // stop upward velocity     
// player is no longer really in that cell, we clamped them to the cell below       
			Lcell = Lcelldown;                         
			Lcellright = Lcelldiag;          // (ditto)      
			ny = 0;                        // player no longer overlaps the cells below 
			this.health -= 1;
		}
	}

	if (this.velocity.x > 0) 
	{       
		if ((Lcellright && !Lcell) || (Lcelldiag  && !Lcelldown && ny))  
		{  // clamp the x position to avoid moving into the tile we just hit       
			this.position.x = this.position.x -8; //tileToPixel(tx);         
			this.velocity.x = 0;      // stop horizontal velocity 
			this.health -= 1;
		}  
	} 
	else if (this.velocity.x < 0) 
	{         
		if ((Lcell && !Lcellright) || (Lcelldown && !Lcelldiag && ny))  
		{  // clamp the x position to avoid moving into the tile we just hit    
			this.position.x = this.position.x +8;//tileToPixel(tx +1);         
			this.velocity.x = 0;        // stop horizontal velocity   
			this.health -= 1;
		} 
	}
}

Player.prototype.draw = function() 
{ 
	context.save();
	context.translate(this.position.x- worldOffsetX, this.position.y - worldOffsetY);
	context.rotate(this.rotation);
	this.sprite.draw(context, 0,0);		
	context.restore(); 
}