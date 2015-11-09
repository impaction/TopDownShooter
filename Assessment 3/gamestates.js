var STATE_TITLE = 0;
var STATE_GAME = 1;
var STATE_LEVELCOMPLETE = 2;
var STATE_GAMECOMPLETE = 3;
var STATE_GAMEOVER = 4;
var STATE_CREDITS = 5;

var Statecd = 0;

var levelN = level1;

// default launch screen
var gameState = STATE_TITLE; //STATE_TITLE or STATE_GAME or STATE_GAMEOVER

//title screen text
function titleText()
{
	context.fillStyle = "yellow";  
	context.font="40px Arial";  
	context.fillText("One Man Army !",500, 125);
	
	context.fillStyle = "white";  
	context.font="30px Arial"; 
	context.fillText("Press ENTER to start",500, 350);
	context.fillText("Press 1 for credits ",500, 400);
	
	context.font="20px Arial";
	context.fillText("<WASD = Movement>",25, 700);
	context.fillText("<QE = Strafe>",375, 700);
	context.fillText("<Numpad 1 = Shoot>", 725, 700);
	context.fillText("<Numpad 2 = Grenade>", 1075, 700);
	
}
//title screen function
function runTitle(deltaTime)
{
	context.clearRect(0, 0, canvas.width, canvas.height);	//clear previous screen
	
	var background = new Image();	
	background.src = "titlesplash.jpg";		
	context.drawImage(background, 0, 0);	// draw bg
	
	titleText();							// draw text
	
	if (Statecd > 0)
	{
		Statecd -= deltaTime;
	}
//enter game
	if(keyboard.isKeyDown(keyboard.KEY_ENTER) == true) 
	{
		if (Statecd <= 0)
		{
			player.position.set( 2*TILE,2*TILE); //set player pos for lv1
			player.score = 0;		//reset player score
			gameState = STATE_GAME;
			musicBackgroundTitle.stop();
			musicBackgroundL1.play();
			return;
		}
	} 

	if(keyboard.isKeyDown(keyboard.KEY_1) == true) 
	{
		if (Statecd <= 0)
		{
			Statecd = 2;
			gameState = STATE_CREDITS;
			return;
		}
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
				player.score += 5;
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
			sfxExplode.play();
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
				if(intersects(explosions[i].position.x, explosions[i].position.y, explosions[i].position.x +32, explosions[i].position.y +32, //TILE, TILE,
				enemies[j].position.x, enemies[j].position.y, TILE, TILE) == true)
				{
// check last enemy for boss spawn
					if (enemies.length == 1)
					{
						spawnBoss();
					}
// kill the enemy
					enemies.splice(j, 1);
					player.score += 5;
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
	context.fillText(player.score, 1190, 715);
	
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
		context.fillText(enemies.length, 1190, 50);
	}
	
	if (bosses.length > 0)
	{
		context.fillText(bosses[0].health, 1190, 50);
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_3) == true) 
	{
		gameState = STATE_LEVELCOMPLETE;
		return;     
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_4) == true) 
	{
		musicBackgroundL1.stop();
		musicBackgroundL2.stop();
		musicBackgroundL3.stop();
		musicBackgroundGO.play();
		gameState = STATE_GAMEOVER;
		return;     
	} 

}
//----------------------------------------------------
//level complete text
function lvCompText(deltaTime)
{
	context.fillStyle = "white";  
	context.font="30px Arial";  
	context.fillText("CONGRATULATIONS !", 470, 125);
	context.fillText("Level Complete", 500, 200);
	context.fillText("Score  " + player.score ,530, 275);
	
	context.font="20px Arial";
	context.fillText("<Press ENTER>",550, 700);
}
//level complete splash
function runLvComp(deltaTime)
{
	context.clearRect(0, 0, canvas.width, canvas.height);	//clear previous screen
	
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
		musicBackgroundL3.stop();
		musicBackgroundGC.play();
		gameState = STATE_GAMECOMPLETE;
		return
	}
	
	var background = new Image();			
	background.src = "levelcompletesplash.jpg";		//draw bg
	context.drawImage(background, 0, 0);
	
	lvCompText();
	
	if(keyboard.isKeyDown(keyboard.KEY_ENTER) == true) 
	{
		
		if (levelN == level1)		// go to lv 2
		{
			levelN = level2;
			musicBackgroundL1.stop();
			musicBackgroundL2.play();
			player.position.set( 45*TILE,45*TILE); //set player start pos
			initialize(levelN); 
		
			gameState = STATE_GAME;
			return;
		}
		
		if (levelN == level2)		//go to lv 3
		{
			levelN = level3;
			musicBackgroundL2.stop();
			musicBackgroundL3.play();
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
	context.fillStyle = "white";  
	context.font="30px Arial";  
	context.fillText("CONGRATULATIONS !", 470, 150);
	context.fillText("Game Complete", 510, 210);
	context.fillText("Score  " + player.score ,550, 275);
	
	context.font="20px Arial";
	context.fillText("<Press ENTER>",550, 700);
}
// game complete
function runGameComplete(deltaTime)
{
	context.clearRect(0, 0, canvas.width, canvas.height);	//clear previous screen
	var background = new Image();			
	background.src = "gamecompletesplash.jpg";		//draw bg
	context.drawImage(background, 0, 0);
	
	gameCompleteText();
	
	levelN = level1;		//reset level progress
	
	if(keyboard.isKeyDown(keyboard.KEY_ENTER) == true) 
	{
		if (Statecd <= 0)
		{
			Statecd = 2;
			musicBackgroundGC.stop();
			musicBackgroundTitle.play();
			gameState = STATE_TITLE;
			return;
		}
	}
}

// game over text
function gameOverText(deltaTime)
{
	context.fillStyle = "white";  
	context.font="30px Arial";  
	context.fillText("Game Over !", 540, 100);
	context.fillText("Score   " + player.score ,550, 200);
	
	context.font="20px Arial"; 
	context.fillText("<Press ENTER>",525, 700);
}
// game over splash
function runGameOver(deltaTime)
{
	context.clearRect(0, 0, canvas.width, canvas.height);	//clear previous screen
	var background = new Image();			
	background.src = "gameoversplash.jpg";		//draw bg
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
	
//return to title after enter
	if(keyboard.isKeyDown(keyboard.KEY_ENTER) == true) 
	{
		if (Statecd <= 0)
		{
			Statecd = 2;
			musicBackgroundGO.stop();
			musicBackgroundTitle.play();
			gameState = STATE_TITLE;
			return;
		}
	}
}

function creditText()
{
	context.fillStyle = "yellow";  
	context.font="40px Arial";  
	context.fillText("Credits",500, 125);
	
	context.font="20px Arial";
	context.fillStyle = "white";
	context.fillText("Music      Blizzard Eneterainment",200, 250);
	context.fillText("Sound EFX         SoundBible.com",200, 300);
	context.fillText("Sprites         2dgameartguru.com",200, 350);
	context.fillText("Tiles            opengameart.org",200, 400);
	
	context.fillText("Damian Castle       Level Design / Animations",550, 300);
	context.fillText("Ryan Vinter       Game Programmer",550, 350);
	context.fillStyle = "yellow"; 
	context.fillText("^^ Special Thanx to Matt & the other staff & students at AIE ^^",325, 500);
	
	context.fillStyle = "white";
	context.fillText("< Press 1 to return to title >", 450, 650);
}

function runCredits(deltaTime)
{
	context.clearRect(0, 0, canvas.width, canvas.height);	//clear previous screen
	
	var background = new Image();	
	background.src = "titlesplash.jpg";
	context.drawImage(background, 0, 0);	// draw bg
	
	creditText();
	
	if (Statecd > 0)
	{
		Statecd -= deltaTime;
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_1) == true) 
	{
		if (Statecd <= 0)
		{
			Statecd = 2;
			gameState = STATE_TITLE;
			return;
		}
	}      	
}