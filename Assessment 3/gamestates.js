var STATE_TITLE = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;

var gameOverTimer = 5;

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
		gameState = STATE_GAME;
		return;     
	}      
}


//-------------   rungame function ------------------
function runGame(deltaTime)
{
	context.clearRect(0, 0, canvas.width, canvas.height);	//clear previous screen
	
	context.fillStyle = "black";  
	context.font="30px Arial";  
	context.fillText("Playing Game SHIFT !",240, 100);
	
	if(keyboard.isKeyDown(keyboard.KEY_SHIFT) == true) 
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


// game over text
function gameOverText()
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
	
//return to title after timer
	gameOverTimer -= deltaTime;	
	if(gameOverTimer <= 0)
	{
		gameState = STATE_TITLE;
		gameOverTimer = 5;
	}
}