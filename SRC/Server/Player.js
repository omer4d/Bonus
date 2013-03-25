function Player()
{
	this.score = 0;
	this.letters = new Array();
}

// ***********
// * Exports *
// ***********

exports.create = function()
{
	return new Player();
}