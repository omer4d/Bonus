// ******************
// * Lobby Messages *
// ******************

function AddGameMsg(game)
{
	this.type = "LobbyMsg";
	this.cmd = "AddGame";
	this.gameName = game.name;
	this.gameHost = game.host;
}

function RemoveGameMsg(index)
{
	this.type = "LobbyMsg";
	this.cmd = "RemoveGame";
	this.gameIndex = index;
}

function AddClientMsg(client)
{
	this.type = "LobbyMsg";
	this.cmd = "AddClient";
	this.clientName = client.name;
}

function RemoveClientMsg(index)
{
	this.type = "LobbyMsg";
	this.cmd = "RemoveClient";
	this.clientIndex = index;
}

function FullUpdateMsg(lobby)
{
	this.type = "LobbyMsg";
	this.cmd = "FullUpdate";
	this.clientNameArr = [];
	this.gameInfoArr = [];
	
	for(var i = 0; i < lobby.clientArr.length; ++i)
		this.clientNameArr.push(lobby.clientArr[i].name);
		
	for(var i = 0; i < lobby.gameArr.length; ++i)
		this.gameInfoArr.push(
			{
				name : lobby.gameArr[i].name,
				host : lobby.gameArr[i].host
			}
		);
}

// ****************
// * Lobby Object *
// ****************

function Lobby()
{
	this.clientArr = [];
	this.gameArr = [];
}

Lobby.prototype.addClient = function(client)
{
	this.clientArr.push(client);
	return new AddClientMsg(client);
}

Lobby.prototype.removeClient = function(client)
{
	var i = this.clientArr.indexOf(client);
	this.clientArr.splice(i, 1);
	return new RemoveClientMsg(i);
}

Lobby.prototype.addGame = function(game)
{
	this.gameArr.push(game);
	return new AddGameMsg(game);
}

Lobby.prototype.removeGame = function(game)
{
	var i = this.gameArr.indexOf(game);
	this.gameArr.splice(i, 1);
	return new RemoveGameMsg(i);
}

Lobby.prototype.getFullUpdateMsg = function()
{
	return new FullUpdateMsg(this);
}

// ***********
// * Exports *
// ***********

exports.create = function()
{
	return new Lobby();
}