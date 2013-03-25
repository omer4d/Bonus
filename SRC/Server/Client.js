function Client(name, connection)
{
	this.connection = connection;
	this.name = name;
	this.player = null;
	this.game = null;
	
	this.updatedProps = [];
}

// ***********
// * Exports *
// ***********

exports.create = function(name, connection)
{
	return new Client(name, connection);
}