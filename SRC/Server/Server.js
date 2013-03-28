var WebsockServer = require('websocket').server;
var Http = require('http');

var Lobby = require("./Lobby.js");
var Client = require("./Client.js");

var Player = require("./Player.js");
var Game = require("./Game.js");
var Dictionary = require("./Dictionary.js");

//
//
//

// ****************
// * Init servers *
// ****************

var websockPort = 666;

var webServer = Http.createServer(
	function(request, response)
	{
		// Serve lobby here in the future?
	}
).listen(websockPort,
	function()
	{
		console.log("Listening on port " + websockPort);
	}
);

var gameServer = new WebsockServer({httpServer: webServer});

// ********************
// * Helper functions *
// ********************

function sendMsg(connection, msg)
{
	connection.sendUTF(JSON.stringify(msg));
}

// ************
// * Messages *
// ************

function JoinedLobbyMsg(name)
{
	this.type = "JoinedLobbyMsg";
	this.name = name;
}

function JoinedGameMsg()
{
	this.type = "JoinedGameMsg";
}

// ******************
// * Handle clients *
// ******************

var lobby = Lobby.create();
var connectionCounter = 0;

function sendMsgAll(msg)
{
	for(var i = 0; i < lobby.clientArr.length; ++i)
		sendMsg(lobby.clientArr[i].connection, msg);
}

function handleMsg(client, msg)
{
	if(msg.type == "ConnectionMsg")
	{
		if(lobby.containsClient(client))
		{
			console.log("Received invalid ConnectionMsg");
			return;
		}
	
		client.name = msg.name;
		sendMsg(client.connection, new JoinedLobbyMsg(client.name));
		sendMsg(client.connection, lobby.getFullUpdateMsg());
		sendMsgAll(lobby.addClient(client));
	}
	
	else if(msg.type == "OpenGameMsg")
	{
		if(!lobby.containsClient(client) || client.isInGame())
		{
			console.log("Received invalid OpenGameMsg");
			return;
		}
		
		console.log("Opening game: " + msg.name);
		sendMsg(client.connection, new JoinedGameMsg());
		
		var game = Game.create(msg.name, client.name, Dictionary.create("eng.dict"));
		client.game = game;
		
		msg = null; // Kill msg to prevent the closure from keeping it alive.
		
		// Assing a player object and forward game messages to client:
		client.player = game.join(client.name,
			function(msg)
			{
				sendMsg(client.connection, msg);
			}
		);
		
		sendMsgAll(lobby.addGame(game));
		sendMsgAll(lobby.removeClient(client));
	}
	
	else if(msg.type == "JoinGameMsg")
	{
		if(!lobby.containsClient(client) || client.isInGame() || !lobby.validGameIndex(msg.gameIndex))
		{
			console.log("Received invalid JoinGameMsg " +
						!lobby.containsClient(client) + " " + client.isInGame() + " " + !lobby.validGameIndex(msg.index) + " " + msg.index);
			return;
		}
		
		var game = lobby.gameArr[msg.gameIndex];
		
		sendMsg(client.connection, new JoinedGameMsg());
		
		client.game = game;
		msg = null; // Kill msg to prevent the closure from keeping it alive.
		
		// Assing a player object and forward game messages to client:
		client.player = game.join(client.name,
			function(msg)
			{
				sendMsg(client.connection, msg);
			}
		);
		
		sendMsgAll(lobby.removeClient(client));
		sendMsgAll(lobby.removeGame(game));
	}
	
	else
		console.log("Unhandled msg: " + msg.type);
}

gameServer.on('request',
	function(request)
	{
		var connection = request.accept(null, request.origin);
		var client = Client.create("Client " + connectionCounter, connection);
		
		++connectionCounter;
		console.log(request.remoteAddress + ' connected.');
		
		connection.on('message',
			function(raw)
			{			
				if(raw.type === 'utf8')
				{
					try
					{
						var msg = JSON.parse(raw.utf8Data);
					}
					catch(e)
					{
						console.log("Received corrupted message: " + raw.utf8Data);
						return;
					}
					
					handleMsg(client, msg);
				}
			}
		);
		
		connection.on('close',
			function(connection)
			{
				if(!client.isInGame())
					sendMsgAll(lobby.removeClient(client));
				
				else if(!client.game.ongoing)
				{
					console.log("Closing game [" + client.game.name + "].");
					sendMsgAll(lobby.removeGame(client.game));
				}
				
				console.log("Client [" + client.name + "] disconnected.");
			}
		);
	}
);