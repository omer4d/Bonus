var Tileset = require("./Tileset.js");

//
//
//

function Board(w, h, tileset)
{
	this.w = w;
	this.h = h;
	this.tileset = tileset;
	
	var data = new Array(w);
	
	for(var i = 0; i < w; ++i)
	{
		data[i] = new Array(h);
		
		for(var j = 0; j < h; ++j)
			data[i][j] = Tileset.EMPTY_TILE_INDEX;
	}
	
	this.data = data;
}

Board.prototype.toString = function()
{
	var str = "";
	
	for(var j = 0; j < this.h; ++j)
	{
		for(var i = 0; i < this.w; ++i)
		{
			var tileIndex = this.data[i][j];
			
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

exports.create = function(w, h, tileset)
{
	return new Board(w, h, tileset);
}