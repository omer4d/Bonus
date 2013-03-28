function Dictionary()
{
	this.filename = null;
	this.letterset = null;
}

Dictionary.prototype.getSymbol = function(i)
{
	return this.letterset[i].symbol;
}

function Board()
{	
	var w = 11, h = 11;
	var data = new Array(h);
	
	for(var j = 0; j < h; ++j)
	{
		data[j] = new Array(w);
		
		for(var i = 0; i < w; ++i)
			data[j][i] = Tile.SOLID;
	}
	
	for(var j = 1; j < h - 1; ++j)
		for(var i = 1; i < w - 1; ++i)
			data[j][i] = Tile.EMPTY;
	
	data[0][2] = Tile.BONUS;
	data[0][4] = Tile.BONUS;
	data[0][7] = Tile.BONUS;
	
	data[h - 1][w - 3] = Tile.BONUS;
	data[h - 1][w - 5] = Tile.BONUS;
	data[h - 1][w - 8] = Tile.BONUS;
	
	data[2][0] = Tile.BONUS;
	data[4][0] = Tile.BONUS;
	data[7][0] = Tile.BONUS;
	
	data[h - 3][w - 1] = Tile.BONUS;
	data[h - 5][w - 1] = Tile.BONUS;
	data[h - 8][w - 1] = Tile.BONUS;
	
	this.w = w;
	this.h = h;
	this.data = data;
}

function Player()
{
	this.name = "-";
	this.score = 0;
	this.bank = [Tile.EMPTY, Tile.EMPTY, Tile.EMPTY, Tile.EMPTY,
				Tile.EMPTY, Tile.EMPTY, Tile.EMPTY, Tile.EMPTY];
}

function Game()
{
	this.board = new Board();
	this.playerArr = [new Player(), new Player()];
	this.dictionary = new Dictionary();
}

Game.prototype.getSymbol = function(tileId)
{
	return this.dictionary.getSymbol(tileId - Tile.FIRST_LETTER);
}

Game.prototype.parseMsg = function(msg)
{
	if(msg.cmd == "Start")
	{
		this.dictionary.filename = msg.dictionary.filename;
		this.dictionary.letterset = msg.dictionary.letterset;
		
		this.playerArr[0].name = msg.player1.name;
		this.playerArr[0].bank = msg.player1.bank;
		
		this.playerArr[1].name = msg.player2.name;
		this.playerArr[1].bank = msg.player2.bank;
	}
}
