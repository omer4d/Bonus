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

function generatePatch(dest, src)
{
	var updated = false;
	
	// Copy marked primitives and arrays:
	if(src.updatedProps instanceof Array && src.updatedProps.length > 0)
	{
		var updatedProps = src.updatedProps;
		updated = true;
		
		for(var i = 0; i < updatedProps.length; ++i)
		{
			var prop = updatedProps[i];
			
			if(src[prop] instanceof Array || !(src[prop] instanceof Object || src[prop] instanceof Function))
				dest[prop] = src[prop];
		}
	}
	
	src.updatedProps = [];
	
	// Copy any internal objects that have updated properties:
	for(var prop in src)
	{
		if(src[prop] instanceof Object && !(src[prop] instanceof Array))
		{
			var tmp = {};
			if(generatePatch(tmp, src[prop]))
			{
				updated |= true;
				dest[prop] = tmp;
			}
		}
	}
	
	return updated;
}

function sendMsg(connection, msg)
{
	connection.sendUTF(JSON.stringify(msg));
}

/*
function sendModelUpdate(connection, modelName, patch)
{
	var msg = {};
	
	msg.type = "modelUpdate";
	msg.modelName = modelName;
	msg.patch = patch;
	
	connection.sendUTF(JSON.stringify(msg));
}

function sendClientModelUpdate(connection, client)
{
	var patch = {};
	
	if(generatePatch(patch, client))
	{
		console.log("Sending patch!");
		sendModelUpdate(connection, "client", patch);
	}
}*/

// ******************
// * Handle clients *
// ******************

var clientArr = new Array();
var lobby = Lobby.create();
var connectionCounter = 0;

gameServer.on('request',
	function(request)
	{
		var connection = request.accept(null, request.origin);
		var client = Client.create("Client " + connectionCounter, connection);
		
		++connectionCounter;
		console.log(request.remoteAddress + ' connected.');
		
		//client.updatedProps.push("name");
		//sendClientModelUpdate(connection, client);
		
		sendMsg(client.connection, lobby.getFullUpdateMsg());
		var msg = lobby.addClient(client);//LobbyMsg.createAddClientMsg(client.name);
		
		// Nofity all lobby clients that a client has connected:
		for(var i = 0; i < lobby.clientArr.length; ++i)
			sendMsg(lobby.clientArr[i].connection, msg);
		
		connection.on('message',
			function(message)
			{
				if(message.type === 'utf8')
				{
					console.log("[Client #" + client.index + "]: " + message.utf8Data);
				}
			}
		);
		
		connection.on('close',
			function(connection)
			{
				var msg = lobby.removeClient(client);
				
				// Notify all lobby clients that a client has left:
				for(var i = 0; i < lobby.clientArr.length; ++i)
				{
					sendMsg(lobby.clientArr[i].connection, msg);
				}
				
				var i = clientArr.indexOf(client);
				console.log("[Client #" + i + "] disconnected.");
				clientArr.splice(i, 1);
			}
		);
	}
);

/*
var game = Game.create(Dictionary.create("eng.dict"));

console.log("" + game.board.tileset + "\n" + game.board);

setTimeout(null, 2000);*/