var SOLID_TILE_INDEX = 0;

var EMPTY_TILE_INDEX = 1;
var SPECIAL_TILE_INDEX = 2;
var FIRST_LETTER_INDEX = 3;

function Tileset()
{
	this.data = [null, null, null];
	this.lettersStart = FIRST_LETTER_INDEX;
}

function Board(w, h)
{
	this.w = w;
	this.h = h;
	this.tileset = new Tileset();
	
	var data = new Array(w);
	
	for(var i = 0; i < w; ++i)
	{
		data[i] = new Array(h);
		
		for(var j = 0; j < h; ++j)
			data[i][j] = SOLID_TILE_INDEX;
	}
	
	for(var i = 1; i < w - 1; ++i)
		for(var j = 1; j < h - 1; ++j)
			data[i][j] = EMPTY_TILE_INDEX;
	
	data[0][2] = SPECIAL_TILE_INDEX;
	data[0][4] = SPECIAL_TILE_INDEX;
	data[0][7] = SPECIAL_TILE_INDEX;
	
	data[h - 1][w - 3] = SPECIAL_TILE_INDEX;
	data[h - 1][w - 5] = SPECIAL_TILE_INDEX;
	data[h - 1][w - 8] = SPECIAL_TILE_INDEX;
	
	data[2][0] = SPECIAL_TILE_INDEX;
	data[4][0] = SPECIAL_TILE_INDEX;
	data[7][0] = SPECIAL_TILE_INDEX;
	
	data[h - 3][w - 1] = SPECIAL_TILE_INDEX;
	data[h - 5][w - 1] = SPECIAL_TILE_INDEX;
	data[h - 8][w - 1] = SPECIAL_TILE_INDEX;

	this.data = data;
}

function Player()
{
	this.name = "";
	this.score = 0;
	this.letters = [EMPTY_TILE_INDEX, EMPTY_TILE_INDEX, EMPTY_TILE_INDEX, EMPTY_TILE_INDEX,
					EMPTY_TILE_INDEX, EMPTY_TILE_INDEX, EMPTY_TILE_INDEX, EMPTY_TILE_INDEX];
}

function Game()
{
	this.board = new Board(11, 11);
	this.playerArr = [new Player(), new Player()];
}