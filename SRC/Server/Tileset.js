// A "tile" is any of the following:
// - A letter square
// - An empty square (where a letter may be placed)
// - A solid square (where a letter may never be placed)
// - A special square (a bonus or whatever)
// The tileset contains an array of all the possible game tiles.
// The game board contains indices into the tileset so you could look up the sort of tile each cell contains.
// The purpose of the tileset is to ease synching the server and client game boards by transferring
// tileset indices instead of actual tile objects.

var Letter = require("./Letter.js");

//
//
//

var SOLID_TILE_INDEX = 0;

var EMPTY_TILE_INDEX = 1;
var SPECIAL_TILE_INDEX = 2;
var FIRST_LETTER_INDEX = 3;

function Tileset(charset)
{
	var data = new Array();
	
	data[SOLID_TILE_INDEX] = null;
	data[EMPTY_TILE_INDEX] = null;
	// This one may reference an actual object with data in the future:
	data[SPECIAL_TILE_INDEX] = null;
	
	// Create the letter tiles:
	for(var i = 0; i < charset.length; ++i)
	   data[FIRST_LETTER_INDEX + i] = Letter.create(charset[i], 1);
	
	this.data = data;
	this.lettersStart = FIRST_LETTER_INDEX;
	this.lettersEnd = FIRST_LETTER_INDEX + charset.length;
}

Tileset.prototype.toString = function()
{
	var str = "";
	
	for(var i = this.lettersStart; i < this.lettersEnd; ++i)
		str += this.data[i].symbol + " ";
		
	return str;
}

// ***********
// * Exports *
// ***********

exports.create = function(charset)
{
	return new Tileset(charset);
}

exports.SOLID_TILE_INDEX = SOLID_TILE_INDEX;
exports.EMPTY_TILE_INDEX = EMPTY_TILE_INDEX;
exports.SPECIAL_TILE_INDEX = SPECIAL_TILE_INDEX;
exports.FIRST_LETTER_INDEX = FIRST_LETTER_INDEX;