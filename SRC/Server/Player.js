function Player()
{
	this.name = "";
	this.score = 0;
	this.bank = [];
}

// ***********
// * Exports *
// ***********

exports.create = function()
{
	return new Player();
}