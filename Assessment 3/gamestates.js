var STATE_TITLE = 0;
var STATE_GAME = 1;
var STATE_LEVELCOMPLETE = 2;
var STATE_GAMECOMPLETE = 3;
var STATE_GAMEOVER = 4;

var gameOverTimer = 5;

var levelN = level1;

// default launch screen
var gameState = STATE_TITLE; //STATE_TITLE or STATE_GAME or STATE_GAMEOVER

//title screen text
function titleText()
{
	context.clearRect(0, 0, canvas.width, canvas.height);	//clear previous screen
	
	context.fillStyle = "black";  
	context.font="30px Arial";  
	context.fillText("Start Game ENTER!",240, 100);
}
//title screen function
function runTitle(deltaTime)
{
	var background = new Image();	
	//background.src = "titleSplash.jpg";		
	context.drawImage(background, 0, 0);	// draw bg
	
	titleText();							// draw text
	
//enter game
	if(keyboard.isKeyDown(keyboard.KEY_ENTER) == true) 
	{   
		
		player.position.set( 2*TILE,2*TILE); //set player pos for lv1
		gameState = STATE_GAME;
		return;     
	}      
}

//-------------   rungame function ------------------
function runGame(deltaTime)
{
	context.clearRect(0, 0, canvas.width, canvas.height);	//clear previous screen
	
//update player 	
	player.update(deltaTime);
//draw map level
	drawMap(levelN);	
//draw player
	player.draw();
	
//update draw boss
	for(var i=0; i<bosses.length; i++)
	{
		bosses[i].update(deltaTime);		
	}

//update draw enemy
	for(var i=0; i<enemies.length; i++)
	{
		enemies[i].update(deltaTime);	
	}

//update draw enemy bullets
	for(var i=0; i<ebullets.length; i++)
	{
		ebullets[i].update(deltaTime);
		ebullets[i].draw(deltaTime);
				
//splice var			
		var ebhit= false;
//timer		
		if (ebullets[i].timer >= 0)
		{
			ebullets[i].timer -= deltaTime;
		}
		
		if (ebullets[i].timer <= 0)
		{
			var ebhit = true;
		}
//player collision		
		if(intersects(ebullets[i].position.x, ebullets[i].position.y, TILE, TILE,
			player.position.x, player.position.y, TILE, TILE) == true)
			{
// kill the bullet
				player.health -= 5;
				ebullets.splice(i, 1);
				break;
			}		
//kill ouside of screen		
		if (ebullets[i].position.x <= -1 || ebullets[i].position.y <= -1 || 
		ebullets[i].position.x > 3200 || ebullets[i].position.y > 3200)
		{
			ebhit = true;
		}
//splice		
		if (ebhit == true) 
		{
			ebullets.splice(i, 1);
			break;
		}
	}	

//update draw enemy2 bullets
	for(var i=0; i<ebullets2.length; i++)
	{
		ebullets2[i].update(deltaTime);
		ebullets2[i].draw(deltaTime);
				
//splice var			
		var eb2hit= false;
//timer		
		if (ebullets2[i].timer >= 0)
		{
			ebullets2[i].timer -= deltaTime;
		}
		
		if (ebullets2[i].timer <= 0)
		{
			var eb2hit = true;
		}
//player collision		
		if(intersects(ebullets2[i].position.x, ebullets2[i].position.y, TILE, TILE,
			player.position.x, player.position.y, TILE, TILE) == true)
			{
// kill the bullet
				player.health -= 5;
				ebullets2.splice(i, 1);
				break;
			}		
//kill ouside of screen		
		if (ebullets2[i].position.x <= -1 || ebullets2[i].position.y <= -1 || 
		ebullets2[i].position.x > 3200 || ebullets2[i].position.y > 3200)
		{
			eb2hit = true;
		}
//splice		
		if (eb2hit == true) 
		{
			ebullets2.splice(i, 1);
			break;
		}
	}
	
//update draw bullets
	for(var i=0; i<bullets.length; i++)
	{
		bullets[i].update(deltaTime);
		bullets[i].draw(deltaTime);
//splice var			
		var bhit= false
//timer		
		if (bullets[i].timer >= 0)
		{
			bullets[i].timer -= deltaTime;
		}
		
		if (bullets[i].timer <= 0)
		{
			var bhit = true;
		}
//boss collision
		for(var j=0; j<bosses.length; j++)
		{
			if(intersects( bullets[i].position.x, bullets[i].position.y, TILE, TILE,
			bosses[j].position.x, bosses[j].position.y, TILE, TILE) == true)
			{
// kill both the bullet and the enemy
				bosses[j].health -= 5;
				bhit = true;
				break;
			}
		}			
//enemy collision	
		for(var j=0; j<enemies.length; j++)
		{
			if(intersects( bullets[i].position.x, bullets[i].position.y, TILE, TILE,
			enemies[j].position.x, enemies[j].position.y, TILE, TILE) == true)
			{
// check last enemy for boss spawn
				if (enemies.length == 1)
				{
					spawnBoss();
				}
// kill both the bullet and the enemy
				enemies.splice(j, 1);
				bhit = true;
				break;
			}
		}
//kill ouside of screen		
		if (bullets[i].position.x <= -1 || bullets[i].position.y <= -1 || 
		bullets[i].position.x > 3200 || bullets[i].position.y > 3200)
		{
			bhit = true;
		}
//splice		
		if (bhit == true) 
		{
			bullets.splice(i, 1);
			break;
		}
	}
	
//update draw grenades
	for(var i=0; i<grenades.length; i++)
	{
		grenades[i].update(deltaTime);
		grenades[i].draw(deltaTime);
//splice var		
		var ghit = false;
//splice timer		
		if (grenades[i].timer >=0)
		{
			grenades[i].timer -= deltaTime;
		}
	
		if (grenades[i].timer <= 0)
		{
			ghit = true;
		}	
//enemies collision		
		for(var j=0; j<enemies.length; j++)
		{
			if(intersects( grenades[i].position.x, grenades[i].position.y, TILE, TILE,
			enemies[j].position.x, enemies[j].position.y, TILE, TILE) == true)
			{
				ghit = true;
			}
		}
//boss collision		
		for(var j=0; j<bosses.length; j++)
		{
			if(intersects( grenades[i].position.x, grenades[i].position.y, TILE, TILE,
			bosses[j].position.x, bosses[j].position.y, TILE, TILE) == true)
			{// kill the boss hp
				bosses[j].health -= 10;
				ghit = true;
			}
		}
//off screen		
		if (grenades[i].position.x <= -1 || grenades[i].position.y <= -1 || 
		grenades[i].position.x > 3200 || grenades[i].position.y > 3200)
		{
			ghit = true;
		}
//explode & splce		
		if (ghit == true) 
		{
			explosion.explode(grenades[i].position.x , grenades[i].position.y);
			grenades.splice(i, 1);
			break;
		}
	}
	
//update draw explosion
	for(var i=0; i<explosions.length; i++)
	{
		explosions[i].update(deltaTime);
		
		if (explosions[i])
		{	
			for(var j=0; j<enemies.length; j++)
			{
				if(intersects(explosions[i].position.x, explosions[i].position.y , TILE, TILE,
				enemies[j].position.x, enemies[j].position.y, TILE, TILE) == true)
				{
// check last enemy for boss spawn
					if (enemies.length == 1)
					{
						spawnBoss();
					}
// kill the enemy
					enemies.splice(j, 1);
					break;
				}
			}
		}
	}

	drawClouds(levelN);
	checkNextLv();
	
//hud text
	context.fillStyle = "white";  
	context.font="20px Arial";  
	context.fillText("Playing Game num1 shoot num2 grenade",240, 100);
	context.fillText("3 level skip 4 instant death",240, 150)

//hud pix
	var hudhealth = document.createElement("img");
	hudhealth.src = "hudhealth.png";
	context.drawImage(hudhealth, 5, 5);	 // 5, 665);
	context.fillText(player.health, 60, 50);
	
	var hudgrenade = document.createElement("img");
	hudgrenade.src = "hudgrenade.png";
	context.drawImage(hudgrenade, 5, 665); // 1225, 665);
	var playergcd = Math.round(player.throwCoolDownTimer);
	context.fillText(playergcd, 60, 715);
	
	var hudscore = document.createElement("img");
	hudscore.src = "hudscore.png";
	context.drawImage(hudscore, 1225, 665); // 5, 5);
	
	var hudenemys = document.createElement("img");
	hudenemys.src = "hudenemy.png";

	var hudboss = document.createElement("img");
	hudboss.src = "hudboss.png";
	
// enemies/ boss health	pix
	if (enemies.length >0)
	{
		context.drawImage(hudenemys, 1225, 5);
	}
	else
	{
		context.drawImage(hudboss, 1225, 5);
	}
//text	
	if (enemies.length >0)
	{
		context.fillText(enemies.length, 1175, 50);
	}
	
	if (bosses.length > 0)
	{
		context.fillText(bosses[0].health, 1175, 50);
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_3) == true) 
	{
		gameState = STATE_LEVELCOMPLETE;
		return;     
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_4) == true) 
	{    
		gameState = STATE_GAMEOVER;
		return;     
	} 

	// draw the FPS  
	context.fillStyle = "#f00";  
	context.font="14px Arial";  
	context.fillText("FPS: " + fps, 5, 20, 100);
	
}
//----------------------------------------------------

//level complete text
function lvCompText(deltaTime)
{
	context.clearRect(0, 0, canvas.width, canvas.height);	//clear previous screen
	
	context.fillStyle = "black";  
	context.font="30px Arial";  
	context.fillText("level Complete!  ", 240, 100);
	context.fillText("Press ENTER !",240, 200);
}
//level complete splash
function runLvComp(deltaTime)
{
	bullets.splice( i, bullets.length);
	grenades.splice( i, grenades.length);
	player.rotation = 0;
	player.shootCooldownTimer = 0;
	player.throwCoolDownTimer = 0;
	player.health = 100;
	
	bosses.splice( i, bosses.length);
	enemies.splice( i, enemies.length);
	ebullets.splice( i, ebullets.length);
	
	if (levelN == level3)		// go to game complete
	{
		levelN = level1;
		player.position.set( 2*TILE,2*TILE); //set player pos for lv1
		initialize(levelN)
		gameState = STATE_GAMECOMPLETE;
		return
	}
	
	var background = new Image();			
	//background.src = "gameOverSplash.jpg";		//draw bg
	context.drawImage(background, 0, 0);
	
	lvCompText();
	
	if(keyboard.isKeyDown(keyboard.KEY_ENTER) == true) 
	{
		
		if (levelN == level1)		// go to lv 2
		{
			levelN = level2;
			player.position.set( 45*TILE,45*TILE); //set player start pos
			initialize(levelN); 
		
			gameState = STATE_GAME;
			return;
		}
		
		if (levelN == level2)		//go to lv 3
		{
			levelN = level3;
			player.position.set( 5*TILE,45*TILE); //player start pos
			initialize(levelN); 
		
			gameState = STATE_GAME;
			return;
		}
	}      
}

//next level check
function checkNextLv()
{
	if (enemies.length == 0 && bosses.length == 0)
	{
		gameState = STATE_LEVELCOMPLETE;
	}
}

//spawnbosscheck
function spawnBoss()
{
	var hasBossSpawned1 = false;
	if (levelN.level == 1)
	{
		if (hasBossSpawned1 == false)		
		{
			boss1.spawn(1600, 1600);
			hasBossSpawned1 = true;
		}
	}
	
	var hasBossSpawned2 = false;
	if (levelN.level == 2)
	{
		if (hasBossSpawned2 == false)		
		{
			boss1.spawn(1500, 450);
			hasBossSpawned2 = true;
		}
	}
	
	var hasBossSpawned3 = false;
	if (levelN.level == 3)
	{
		if (hasBossSpawned3 == false)		
		{
			boss2.spawn(1200, 1500);
			hasBossSpawned3 = true;
		}
	}
}

// game complete text
function gameCompleteText(deltaTime)
{
	context.clearRect(0, 0, canvas.width, canvas.height);	//clear previous screen
	
	context.fillStyle = "black";  
	context.font="30px Arial";  
	context.fillText("Game Complete! ", 240, 100);
	context.fillText("Press 3 to Return to Title  ", 240, 200);
}
// game complete
function runGameComplete(deltaTime)
{
	var background = new Image();			
	//background.src = "gameOverSplash.jpg";		//draw bg
	context.drawImage(background, 0, 0);
	
	gameCompleteText();
	
	levelN = level1;		//reset level progress
	
	if(keyboard.isKeyDown(keyboard.KEY_3) == true) 
	{
		gameState = STATE_TITLE;
		return;
	}
}

// game over text
function gameOverText(deltaTime)
{
	context.clearRect(0, 0, canvas.width, canvas.height);	//clear previous screen
	
	context.fillStyle = "black";  
	context.font="30px Arial";  
	context.fillText("Game Over!  "+ gameOverTimer, 240, 100);
}
// game over splash
function runGameOver(deltaTime)
{
	var background = new Image();			
	//background.src = "gameOverSplash.jpg";		//draw bg
	context.drawImage(background, 0, 0);
	
	gameOverText();								//draw the text
	
	levelN = level1;		//reset level progress
	
//clear the arrays	
	bullets.splice( i, bullets.length);
	grenades.splice( i, grenades.length);
	player.rotation = 0;
	player.health = 100;
	
	bosses.splice( i, bosses.length);
	enemies.splice( i, enemies.length);
	ebullets.splice( i, ebullets.length);
	
	player.position.set( 2*TILE,2*TILE); //set player pos for lv1
	initialize(levelN);
	
//return to title after timer
	gameOverTimer -= deltaTime;	
	if(gameOverTimer <= 0)
	{
		gameState = STATE_TITLE;
		gameOverTimer = 5;
	}
}