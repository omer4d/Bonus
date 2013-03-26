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

function handleMsg(client, msg)
{
	if(msg.type == "ConnectionMsg")
	{
		client.name = msg.name;
		sendMsg(client.connection, new JoinedLobbyMsg(client.name));
		sendMsg(client.connection, lobby.getFullUpdateMsg());
						
		var msg = lobby.addClient(client);
		
		// Nofity all lobby clients that a client has connected:
		for(var i = 0; i < lobby.clientArr.length; ++i)
			sendMsg(lobby.clientArr[i].connection, msg);
	}
	
	else if(msg.type == "StartGameMsg")
	{
		console.log("Starting game: " + msg.name);
		sendMsg(client.connection, new JoinedGameMsg());
		
		var game = Game.create(msg.name, client.name, Dictionary.create("eng.dict"));
		client.game = game;
		client.player = game.join(client.name, null);
		
		var msg1 = lobby.addGame(game);
		var msg2 = lobby.removeClient(client);
		
		// Nofity all lobby clients that a new game has been started:
		for(var i = 0; i < lobby.clientArr.length; ++i)
		{
			sendMsg(lobby.clientArr[i].connection, msg1);
			sendMsg(lobby.clientArr[i].connection, msg2);
		}
	}
	
	else
		console.log("Unhandled msg: " + msg);
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
				{
					var msg = lobby.removeClient(client);
					
					for(var i = 0; i < lobby.clientArr.length; ++i)
						sendMsg(lobby.clientArr[i].connection, msg);
				}
				
				else if(!client.game.ongoing)
				{
					console.log("Closing game [" + client.game.name + "].");
					var msg = lobby.removeGame(client.game);
					
					// Notify all lobby clients that a game has been closed:
					for(var i = 0; i < lobby.clientArr.length; ++i)
						sendMsg(lobby.clientArr[i].connection, msg);
				}
				
				console.log("Client [" + client.name + "] disconnected.");
			}
		);
	}
);