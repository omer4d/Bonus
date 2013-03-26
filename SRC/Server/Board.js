var Tileset = require("./Tileset.js");

//
//
//

function Board(tileset)
{
	var w = 11, h = 11;
	var data = new Array(h);
	
	for(var j = 0; j < h; ++j)
	{
		data[j] = new Array(w);
		
		for(var i = 0; i < w; ++i)
			data[j][i] = Tileset.SOLID_TILE_INDEX;
	}
	
	for(var j = 1; j < h - 1; ++j)
		for(var i = 1; i < w - 1; ++i)
			data[j][i] = Tileset.EMPTY_TILE_INDEX;
	
	data[0][2] = Tileset.SPECIAL_TILE_INDEX;
	data[0][4] = Tileset.SPECIAL_TILE_INDEX;
	data[0][7] = Tileset.SPECIAL_TILE_INDEX;
	
	data[h - 1][w - 3] = Tileset.SPECIAL_TILE_INDEX;
	data[h - 1][w - 5] = Tileset.SPECIAL_TILE_INDEX;
	data[h - 1][w - 8] = Tileset.SPECIAL_TILE_INDEX;
	
	data[2][0] = Tileset.SPECIAL_TILE_INDEX;
	data[4][0] = Tileset.SPECIAL_TILE_INDEX;
	data[7][0] = Tileset.SPECIAL_TILE_INDEX;
	
	data[h - 3][w - 1] = Tileset.SPECIAL_TILE_INDEX;
	data[h - 5][w - 1] = Tileset.SPECIAL_TILE_INDEX;
	data[h - 8][w - 1] = Tileset.SPECIAL_TILE_INDEX;
	
	this.w = w;
	this.h = h;
	this.tileset = tileset;
	this.data = data;
}

Board.prototype.toString = function()
{
	var str = "";
	
	for(var j = 0; j < this.h; ++j)
	{
		for(var i = 0; i < this.w; ++i)
		{
			var tileIndex = this.data[j][i];
			
			switch(tileIndex)
			{
				case Tileset.EMPTY_TILE_INDEX:
					str += ".";
					break;
				case Tileset.SOLID_TILE_INDEX:
					str += "#";
					break;
				case Tileset.SPECIAL_TILE_INDEX:
					str += "*";
					break;
				default:
					str += this.tileset.data[tileIndex].symbol;
			}
		}
		str += "\n";
	}
	
	return str;
}

// ***********
// * Exports *
// ***********

exports.create = function(tileset)
{
	return new Board(tileset);
}