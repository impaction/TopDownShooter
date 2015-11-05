var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}
//-------------------- Don't modify anything above here
//screen
var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

//fps
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

// load the image to use for the level tiles
var tileset = document.createElement("img"); 
tileset.src = "level sprite sheet.png"

//level layers 
var LAYER_FLOOR = 0; 
<<<<<<< HEAD
var LAYER_WALLS = 1;
var LAYER_LAVA = 2;
var LAYER_TREES = 3;
var LAYER_BUSHES = 4;
var LAYER_COUNT = 4;
var LAYER_OBJECT_ENEMY= 5;

=======
var LAYER_LAVA = 1;
var LAYER_WALLS = 2;
var LAYER_TREES = 3;
var LAYER_BUSHES = 4;
var LAYER_OBJECT_ENEMY= 5;
var LAYER_COUNT = 6;
>>>>>>> origin/master

var MAP = { tw: 50, th: 50 }; 
//Specifies how big your level is, in tiles. 
var TILE = 64; 
//The width/height of a tile (in pixels). Your tiles should be square. 
//These dimensions refer to the map grid tiles. Our tileset tiles (the images) can be different dimensions.  
var TILESET_TILE = TILE; 
//The width/height of a tile in the tileset. Because the images are twice as big as the grid in our map 
//we need to be careful (but it allows us a bit more flexibility when designing the level)  
var TILESET_PADDING = 0; 
//How many pixels are between the image border and the tile images in the tilemap 
var TILESET_SPACING = 0; 
//how many pixels are between tile images in the tilemap 
var TILESET_COUNT_X = 24; 
//How many columns of tile images are in the tileset 
var TILESET_COUNT_Y = 20; 
//How many rows of tile images are in the tileset

//arrays
var enemies = [];
var bosses = [];
var bullets = [];
var ebullets = [];
var ebullets2 = [];
var grenades = [];
var explosions = [];

//new obj
var keyboard = new Keyboard();
var vector2 = new Vector2();
var player = new Player();
var enemy = new Enemy();
var boss1 = new Boss1();
var boss2 = new Boss2();
var bullet = new Bullet();
var ebullet = new Ebullet();
var ebullet2 = new Ebullet2();
var grenade = new Grenade();
var explosion = new Explosion();

var cells = [];

function initialize(levelN) 
{          
	for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++)  // initialize the collision map
	{           
		cells[layerIdx] = [];             
		var idx = 0;             
		for(var y = 0; y < levelN.layers[layerIdx].height; y++)
		{                     
			cells[layerIdx][y] = [];             
			for(var x = 0; x < levelN.layers[layerIdx].width; x++) 
			{                 
				if(levelN.layers[layerIdx].data[idx] != 0) 
				{ 
// for each tile we find in the layer data, we need to create 4 collisions because 
//our collision squares are 35x35 but the tile in the level are 70x70                    
					cells[layerIdx][y][x] = 1;                       
					//cells[layerIdx][y-1][x] = 1;                         
					//cells[layerIdx][y-1][x+1] = 1;                       
					cells[layerIdx][y][x+1] = 1;                    
				} 

				else if(cells[layerIdx][y][x] != 1) 
				{ 	// if we haven't set this cell's value, then set it to 0 now                     
					cells[layerIdx][y][x] = 0;                      
				} 
				idx++;             
			}         
		}        
	}
	
// add enemies from tile layer
	idx = 0;
	for(var y = 0; y < levelN.layers[LAYER_OBJECT_ENEMY].height; y++) 
	{        
		for(var x = 0; x < levelN.layers[LAYER_OBJECT_ENEMY].width; x++) 
		{
			if(levelN.layers[LAYER_OBJECT_ENEMY].data[idx] != 0) 
			{
				var px = tileToPixel(x);
				var py = tileToPixel(y);
				var enemy = new Enemy(px, py);
				enemies.push(enemy);
			}
			idx++;
		}
	} 	
}

function cellAtPixelCoord(layer, x,y)    
{  
	if(x<0 || x>SCREEN_WIDTH || y<0)   
		return 1;    // let the player drop of the bottom of the screen (this means death)  
	if(y>SCREEN_HEIGHT)   
		return 0;   
	return cellAtTileCoord(layer, pixelToTile(x), pixelToTile(y));     
};  

function cellAtTileCoord(layer, tx, ty)  
{   
	if(tx<0 || tx>=MAP.tw || ty<0)   
		return 1;  // let the player drop of the bottom of the screen (this means death)  
	if(ty>=MAP.th)   
		return 0;    
	return cells[layer][ty][tx]; 
};  

function tileToPixel(tile)  
{  
	return tile * TILE; 
};  

function pixelToTile(pixel)  
{  
	return Math.floor(pixel/TILE);  
};  

function bound(value, min, max) 
{  
	if(value < min)   
		return min;  
	if(value > max)   
		return max;  
	return value; 
}

var worldOffsetX = 1;
var worldOffsetY = 1;
function drawMap(levelN) 
{ 
	var startX = -1;
	var startY = -1;
	var maxTilesX = Math.floor(SCREEN_WIDTH / TILE) + 2;
	var maxTilesY = Math.floor(SCREEN_HEIGHT / TILE) + 2;
	var tileX = pixelToTile(player.position.x);
	var tileY = pixelToTile(player.position.y);
	var offsetX = TILE + Math.floor(player.position.x%TILE);
	var offsetY = TILE + Math.floor(player.position.y%TILE);
	
	startX = tileX - Math.floor(maxTilesX / 2);
	startY = tileY - Math.floor(maxTilesY / 2);
	
	if(startX <= -2) 
	{
		startX = 0;
		offsetX = 0;
	}
	
	if(startY <= -3) 
	{
		startY = -1;
		offsetY = -1;
	}
	
	if(startX > (MAP.tw - maxTilesX ))
	{
		startX = MAP.tw - maxTilesX + 1;
		offsetX = TILE;
	}
	
	if(startY > (MAP.th - maxTilesY - 1))
	{
		startY = MAP.th - maxTilesY;
		offsetY = TILE;
	}
	
	worldOffsetX = startX * TILE + offsetX;
	worldOffsetY = startY * TILE + offsetY; 
	
	for( var layerIdx=0; layerIdx < LAYER_COUNT; layerIdx++ )
	{		
		for( var y = 0; y < levelN.layers[layerIdx].height;  y++ ) 
		{
			var idx = y * levelN.layers[layerIdx].width + startX;
			
			for( var x = startX; x < startX + maxTilesX;  x++ ) 
			{
				if( levelN.layers[layerIdx].data[idx] != 0 )
				{
// the tiles in the Tiled map are base 1 (meaning a value of 0 means no tile),
//so subtract one from the tilesetid to get the correct tile
					var tileIndex = levelN.layers[layerIdx].data[idx] - 1;
					var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * 
						(TILESET_TILE + TILESET_SPACING);
					var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_X)) *
						(TILESET_TILE + TILESET_SPACING);
					context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, 
					(x-startX)*TILE - offsetX, (y -1)*TILE - worldOffsetY, TILESET_TILE, TILESET_TILE);
				}
				idx++;
			}
		}
	}
}

function drawClouds(levelN) 
{ 
	var startX = -1;
	var startY = -1;
	var maxTilesX = Math.floor(SCREEN_WIDTH / TILE) + 2;
	var maxTilesY = Math.floor(SCREEN_HEIGHT / TILE) + 2;
	var tileX = pixelToTile(player.position.x);
	var tileY = pixelToTile(player.position.y);
	var offsetX = TILE + Math.floor(player.position.x%TILE);
	var offsetY = TILE + Math.floor(player.position.y%TILE);
	
	startX = tileX - Math.floor(maxTilesX / 2);
	startY = tileY - Math.floor(maxTilesY / 2);
	
	if(startX <= -2) 
	{
		startX = 0;
		offsetX = 0;
	}
	
	if(startY <= -3) 
	{
		startY = -1;
		offsetY = -1;
	}
	
	if(startX > (MAP.tw - maxTilesX ))
	{
		startX = MAP.tw - maxTilesX + 1;
		offsetX = TILE;
	}
	
	if(startY > (MAP.th - maxTilesY - 1))
	{
		startY = MAP.th - maxTilesY;
		offsetY = TILE;
	}
	
	worldOffsetX = startX * TILE + offsetX;
	worldOffsetY = startY * TILE + offsetY; 
	
	for( var layerIdx= 3; layerIdx == LAYER_TREES; layerIdx++ )
	{
		for( var y = 0; y < levelN.layers[layerIdx].height;  y++ ) 
		{
			var idx = y * levelN.layers[layerIdx].width + startX;
		
			for( var x = startX; x < startX + maxTilesX;  x++ ) 
			{
				if( levelN.layers[layerIdx].data[idx] != 0 )
				{
// the tiles in the Tiled map are base 1 (meaning a value of 0 means no tile),
//so subtract one from the tilesetid to get the correct tile
				var tileIndex = levelN.layers[layerIdx].data[idx] - 1;
				var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * 
					(TILESET_TILE + TILESET_SPACING);
				var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_X)) *
					(TILESET_TILE + TILESET_SPACING);
				context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, 
				(x-startX)*TILE - offsetX, (y -1)*TILE - worldOffsetY, TILESET_TILE, TILESET_TILE);
				}
			idx++;
			}
		}
		
	}
}

//collision checking function
function intersects(x1, y1, w1, h1, x2, y2, w2, h2) 
{  
	if (y2 + h2 < y1 ||   
		x2 + w2 < x1 ||   
		x2 > x1 + w1 ||   
		y2 > y1 + h1)  
	{ 
		return false;	
	}  
	return true; 
}
	
//run function
function run()
{
	var deltaTime = getDeltaTime();
	
	switch(gameState)
	{
		case STATE_TITLE:
		runTitle(deltaTime);
		break;
		
		case STATE_GAME:
		runGame(deltaTime);
		break;
		
		case STATE_LEVELCOMPLETE:
		runLvComp(deltaTime);
		break;
		
		case STATE_GAMECOMPLETE:
		runGameComplete(deltaTime);
		break
		
		case STATE_GAMEOVER:
		runGameOver(deltaTime);
		break;
	}
}

initialize(levelN);

//-------------------- Don't modify anything below here
// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() 
{
  var onEachFrame;
  if (window.requestAnimationFrame) 
  {
    onEachFrame = function(cb) 
	{	
      var _cb = function() 
	  { 
		cb(); 
		window.requestAnimationFrame(_cb); 
	  }
     _cb();
    };
  } 
  else if (window.mozRequestAnimationFrame) 
  {
    onEachFrame = function(cb) 
	{
      var _cb = function() 
	  { 
		cb(); 
		window.mozRequestAnimationFrame(_cb); 
	  }
     _cb();
    };
  } 
  else 
  {
    onEachFrame = function(cb) 
	{
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
