function Player(name, num)
{
	this.name = name;
	this.num = num;
	
	this.updatedProps = [];
}

function Tile()
{
	this.symbol = "A";
}

function Game()
{
	this.player1 = new Player("Player1", 66);
	this.player2 = new Player("Player2", 77);
	this.tileset = new Array();
	this.numbers = [1, 2, 3, 4, 5, 6];
	
	for(var i = 0; i < 10; ++i)
		this.tileset.push(new Tile());
		
	this.updatedProps = [];
}

function generatePatch(dest, src)
{
	var updated = false;
	
	// Copy marked primitives and arrays:
	if(src.updatedProps instanceof Array && src.updatedProps.length > 0)
	{
		var updatedProps = src.updatedProps;
		updated = true;
		
		for(var i = 0; i < updatedProps.length; ++i)
		{
			var prop = updatedProps[i];
			
			if(src[prop] instanceof Array || !(src[prop] instanceof Object || src[prop] instanceof Function))
				dest[prop] = src[prop];
		}
	}
	
	src.updatedProps = [];
	
	// Copy any internal objects that have updated properties:
	for(var prop in src)
	{
		if(src[prop] instanceof Object && !(src[prop] instanceof Array))
		{
			var tmp = {};
			if(generatePatch(tmp, src[prop]))
			{
				updated |= true;
				dest[prop] = tmp;
			}
		}
	}
	
	return updated;
}

function applyPatch(dest, src)
{
	for(var prop in src)
	{
		if(src[prop] instanceof Array)
			dest[prop] = src[prop];
		else if(src[prop] instanceof Object)
		{
			dest[prop] = {};
			applyPatch(dest[prop], src[prop]);
		}
		else if(!(src[prop] instanceof Function))
			dest[prop] = src[prop];
	}
}

var game = new Game();
var gamePatch = {};
var patchedGame = {};

game.player1.updatedProps.push("name");
game.updatedProps.push("numbers");

generatePatch(gamePatch, game);
applyPatch(patchedGame, gamePatch);

console.log(patchedGame);
console.log(game);

//console.log(gameCopy);

//setTimeout(null, 3000)