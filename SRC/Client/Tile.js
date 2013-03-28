var Tile = {};

Tile.SOLID = 0;
Tile.EMPTY = 1;
Tile.BONUS = 2;
Tile.EXIT = 3;
Tile.JOKER = 4;
Tile.FIRST_LETTER = 5;

Tile.isLetter = function(id)
{
	return id >= Tile.FIRST_LETTER;
}