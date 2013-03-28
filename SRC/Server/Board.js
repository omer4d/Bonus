var Tile = require("./Tile.js");

//
//
//

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

// ***********
// * Exports *
// ***********

exports.create = function(tileset)
{
	return new Board(tileset);
}