// ************
// * Messages *
// ************

// **********
// * Client *
// **********

function Client(name, connection)
{
	this.connection = connection;
	this.name = name;
	this.player = null;
	this.game = null;
}

Client.prototype.isInGame = function()
{
	return this.game != null;
}

// ***********
// * Exports *
// ***********

exports.create = function(name, connection)
{
	return new Client(name, connection);
}