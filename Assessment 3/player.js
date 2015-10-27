//player animation variables
var ANIM_WALKING = 0;
var ANIM_IDLE = 1;
var ANIM_MAX = 2;

var Player = function() 
{  
	this.sprite = new Sprite("soldier.png");
 
	this.sprite.buildAnimation(3, 1, 99, 151, 0.2,  //walking
	[0, 1, 2, 1]);
	this.sprite.buildAnimation(3, 1, 99, 151, 0.2,  // idle
	[1]);

	for(var i=0; i<ANIM_MAX; i++)					
	{
		this.sprite.setAnimationOffset(i, -50, -75);								
	}
	this.sprite.setAnimation(ANIM_IDLE);
	
	this.position = new Vector2();  
	this.position.set( 2*TILE, 2*TILE);
	
	this.velocity = new Vector2();
    
	this.width = 159;  
	this.height = 163; 
    
	this.directionX = 0;
	this.directionY = 0;
	this.rotation = 0;
	
	this.xspeed = 0;
	this.yspeed = 0;
	this.speed = 250;
	this.turnspeed = 10;
	
	this.shooting = false;
	this.throwing = false;
	this.shootCooldownTimer = 0;
	this.throwCoolDownTimer = 0;
}; 
		
Player.prototype.update = function(deltaTime)
{	
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
	if(keyboard.isKeyDown(keyboard.KEY_1) == true && this.shootCooldownTimer <= 0) 
	{
		//sfxFire.play();
		this.shooting = true;
		this.shootCooldownTimer += .5;
		this.shoot();
	}
	
//throw grenade ,animation 
	if(keyboard.isKeyDown(keyboard.KEY_2) == true && this.throwCoolDownTimer <= 0)
	{
		//sfxFire.play();
		this.throwing = true;
		this.throwCoolDownTimer += 6;
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
	if(keyboard.isKeyDown(keyboard.KEY_Q) == true) 
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
}

Player.prototype.shoot = function()
{
	var bullet = new Bullet(); 
	bullets.push(bullet);
}

Player.prototype.draw = function() 
{ 
	context.save();
	context.translate(this.position.x- worldOffsetX, this.position.y - worldOffsetY);
	context.rotate(this.rotation);
	this.sprite.draw(context, 0,0);		
	context.restore(); 
}

/*player animation variables
var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;
var ANIM_CLIMBING = 6;
var ANIM_SHOOTING_LEFT = 7;
var ANIM_SHOOTING_RIGHT = 8;
var ANIM_MAX = 9;

var LEFT = 0;
var RIGHT = 1;
var UP = 0;
var DOWN = 0;

var Player = function() 
{  
	this.sprite = new Sprite("ChuckNorris.png");
//idling left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, 
	[0, 1, 2, 3, 4, 5, 6, 7]);
//jumping left							
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, 
	[8, 9, 10, 11, 12]);
//walking left	
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, 
	[13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);
//idling right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, 
	[52, 53, 54, 55, 56, 57, 58, 59]);
//jumping right	
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, 
	[60, 61, 62, 63, 64]);
//walking right	
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
	[65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]);
//climbing
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, 
	[41,42,43,44,45,46,47,48,49,50,51]);
//shooting left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, 
	[27,28,29,30,31,32,33,34,35,36,37,38,39,40]);
//shooting right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, 
	[79,80,81,82,83,84,85,86,87,88,89,90,91,92]);
	
	for(var i=0; i<ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, -75, -100); //(i, -55, -87);								
	}
	
	this.position = new Vector2();  
	this.position.set( 2*TILE,2*TILE);
	
	this.velocity = new Vector2();
    
	this.width = 159;  
	this.height = 163; 
    
	this.direction = RIGHT;
	
	this.shooting = false;
	this.cooldownTimer = 0;
	
}; 		
Player.prototype.update = function(deltaTime)
{	
//update sprite
	this.sprite.update(deltaTime);
	
	var left = false;     
	var right = false; 
	var up = false;
	var	down = false;
	
	this.speed = 500;

	this.shooting = false;
	this.throwing = false;
	
	if (this.cooldownTimer >= 0)
	{ 			
		this.cooldownTimer -= deltaTime;
	}
	
//shoot bullet ,animation 
	if(keyboard.isKeyDown(keyboard.KEY_1) == true)
	{
		this.shooting = true;
		this.cooldownTimer += .25;
	}
	
//throw grenade ,animation 
	if(keyboard.isKeyDown(keyboard.KEY_1) == true)
	{
		this.throwing = true;
		this.cooldownTimer += .25;
	}
	
// move left   
	if(keyboard.isKeyDown(keyboard.KEY_LEFT) == true) 
	{
		left = true;
	}
	
//move right
	else if(keyboard.isKeyDown(keyboard.KEY_RIGHT) == true) 
	{
		right = true;
	} 
	
//move up
	if(keyboard.isKeyDown(keyboard.KEY_UP) == true)  
	{         
		up = true;
	}
	
//move down
	if(keyboard.isKeyDown(keyboard.KEY_DOWN) == true)  
	{         
		down = true;
	}
		
	var wasleft = this.velocity.x < 0;     
	var wasright = this.velocity.x > 0;
	var wasup = this.velocity.y < 0;
	var wasdown = this.velocity.y > 0;
	   
	var ddx = 0;   		// acceleration     
	var ddy = 0;
          
	if (left == true)
	{
		ddx = ddx - this.speed;          // player wants to go left
	}     
	else if (wasleft)
	{		
		ddx = 0; 	// player was going left, but not any more
	}
    if (right == true) 
	{        
		ddx = ddx + this.speed;	// player wants to go right    
	}		
	else if (wasright)         
	{
		ddx = 0;       // player was going right, but not any more 
	}
	
	if (up == true)         
	{
		ddy = ddy - this.speed;	// player wants to go up  
	}		
	else if (wasup)         
	{
		ddy = 0;       // player was going up, but not any more
	}
	
	if (down) 
	{        
		ddy = ddy + this.speed;	// player wants to go down  
	}		
	else if (wasdown)
	{		
		ddy = 0;       // player was going down, but not any more
	}
 
// calculate the new position and velocity:
    this.velocity.x = ddx;     
	this.velocity.y = ddy;
	this.position.y = this.position.y + this.velocity.y * deltaTime;     
	this.position.x = this.position.x + this.velocity.x * deltaTime;   

//collision with walls
	var tx = pixelToTile(this.position.x);  
	var ty = pixelToTile(this.position.y);  
	var nx = (this.position.x)%TILE;         // true if player overlaps right  
	var ny = (this.position.y)%TILE;         // true if player overlaps below  
	
	var cell = cellAtTileCoord(LAYER_WALLS, tx, ty);  
	var cellright = cellAtTileCoord(LAYER_WALLS, tx + 1, ty);  
	var celldown = cellAtTileCoord(LAYER_WALLS, tx, ty + 1);  
	var celldiag = cellAtTileCoord(LAYER_WALLS, tx + 1, ty + 1);
	
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
}

Player.prototype.draw = function() 
{ 
	context.save();
//draw player	
	this.sprite.draw(context, this.position.x - worldOffsetX, 
							  this.position.y - worldOffsetY);											
	context.restore(); 
}
*/