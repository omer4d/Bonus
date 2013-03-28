exports.SOLID = 0;
exports.EMPTY = 1;
exports.BONUS = 2;
exports.EXIT = 3;
exports.JOKER = 4;
exports.FIRST_LETTER = 5;

exports.isLetter = function(id)
{
	return id >= FIRST_LETTER;
}