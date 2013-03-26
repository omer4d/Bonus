var Patch = require("./Patch.js");

function ModelUpdateMsg(client)
{
	this.type = "ModelUpdateMsg";
	this.modelName = "Client";
	this.patch = Patch.create(client);
}

function Client(name, connection)
{
	this.connection = connection;
	this.name = name;
	this.player = null;
	this.game = null;
	
	this.updatedProps = [];
}

Client.prototype.isInGame = function()
{
	return this.game != null;
}

Client.prototype.getModelUpdateMsg = function()
{
	return new ModelUpdateMsg(this);
}

Client.prototype.joinGame = function(game)
{
	
}

// ***********
// * Exports *
// ***********

exports.create = function(name, connection)
{
	return new Client(name, connection);
}