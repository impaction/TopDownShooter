var STATE_TITLE = 0;
var STATE_GAME = 1;
var STATE_LEVELCOMPLETE = 2;
var STATE_GAMECOMPLETE = 3;
var STATE_GAMEOVER = 4;

var gameOverTimer = 5;

var level = level1;

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
	drawMap(level);	
//draw player
	player.draw();
//update draw enemy
	for(var i=0; i<enemies.length; i++)
	{
		enemies[i].update(deltaTime);
		enemies[i].draw(deltaTime);
	}
	
	context.fillStyle = "black";  
	context.font="30px Arial";  
	context.fillText("Playing Game 3 or 4 !",240, 100);
	
	if(keyboard.isKeyDown(keyboard.KEY_3) == true) 
	{
		player.position.set( 2*TILE,2*TILE); //set player pos for lv2
		gameState = STATE_LEVELCOMPLETE;
		return;     
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_4) == true) 
	{    
		player.position.set( 2*TILE,2*TILE); //set player pos for lv3
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
	if (level == level3)		// go to game complete
	{
		gameState = STATE_GAMECOMPLETE;
		return
	}
	
	var background = new Image();			
	//background.src = "gameOverSplash.jpg";		//draw bg
	context.drawImage(background, 0, 0);
	
	lvCompText();
	
	if(keyboard.isKeyDown(keyboard.KEY_ENTER) == true) 
	{
		if (level == level1)		// go to lv 2
		{
			level = level2;
			initialize(level); 
		
			gameState = STATE_GAME;
			return;
		}
		
		if (level == level2)		//go to lv 3
		{
			level = level3;
			initialize(level); 
		
			gameState = STATE_GAME;
			return;
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
	context.fillText("Press 2 to Return to Title  ", 240, 200);
}

// game complete
function runGameComplete(deltaTime)
{
	var background = new Image();			
	//background.src = "gameOverSplash.jpg";		//draw bg
	context.drawImage(background, 0, 0);
	
	gameCompleteText();
	
	level = level1;		//reset level progress
	
	if(keyboard.isKeyDown(keyboard.KEY_2) == true) 
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
	
	level = level1;		//reset level progress
	
//return to title after timer
	gameOverTimer -= deltaTime;	
	if(gameOverTimer <= 0)
	{
		gameState = STATE_TITLE;
		gameOverTimer = 5;
	}
}