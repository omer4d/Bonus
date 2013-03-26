// ********************
// * Helper Functions *
// ********************

/*
function applyPatch(dest, src)
{
	for(var prop in src)
	{
		if(src[prop] instanceof Array)
			dest[prop] = src[prop];
		else if(src[prop] instanceof Object)
		{
			dest[prop] = {};
			applyPatch(dest[prop], src[prop]);
		}
		else if(!(src[prop] instanceof Function))
			dest[prop] = src[prop];
	}
}*/

function sendMsg(connection, msg)
{
	connection.send(JSON.stringify(msg));
}

// *******************
// * Client Messages *
// *******************

function ConnectionMsg(name)
{
	this.type = "ConnectionMsg";
	this.name = name;
}

function StartGameMsg(name)
{
	this.type = "StartGameMsg";
	this.name = name;
}

// *************
// * ClientApp *
// *************

function ClientApp(log)
{
	this.connection = null;
	
	this.log = log;
	this.client =
	{
		name : "",
		game : new Game()
	};
	this.lobby = new Lobby();
	
	this.onConnectionOpen = null;
	this.onLobbyUpdate = null;
	this.onJoinedGame = null;
}

function handleMsg(clientApp, msg)
{
	if(msg.type == "JoinedLobbyMsg")
	{
		clientApp.client.name = msg.name;
	}
		
	else if(msg.type == "JoinedGameMsg")
	{
		if(clientApp.onJoinedGame != null)
			clientApp.onJoinedGame();
	}
		
	else if(msg.type == "LobbyUpdateMsg")
	{
		clientApp.lobby.parseMsg(msg);
			
		if(clientApp.onLobbyUpdate != null)
			clientApp.onLobbyUpdate();
	}
	
	else
	{
		clientApp.log("Unhandled msg: " + msg.type);
	}
}

ClientApp.prototype.connect = function(name)
{
	var clientApp = this;
	
	window.WebSocket = window.WebSocket || window.MozWebSocket;
 
	if(!window.WebSocket)
	{
		this.log("Browser doesn't support WebSock!");
		return;
	}
			
	this.connection = new WebSocket("ws://127.0.0.1:666");
	this.log("Connecting!");

	setInterval(
		function()
		{
			if(clientApp.connection.readyState !== 1)
			{
				clientApp.log("Retrying...");
			}
		}
	, 3000);
	
	this.connection.onopen = function()
	{
		clientApp.log("Connected successfully!");
		
		sendMsg(clientApp.connection, new ConnectionMsg(name));
		
		if(clientApp.onConnectionOpen != null)
			clientApp.onConnectionOpen();
	}
		
	this.connection.onerror = function(error)
	{
		clientApp.log("Can't connect: " + error);
	}
		
	this.connection.onmessage = function(raw)
	{
		try
		{
			var msg = JSON.parse(raw.data);
		}
		catch(e)
		{
			clientApp.log("Received corrupted message: " + raw.data);
			return;
		}
			
		handleMsg(clientApp, msg);
	}
}

ClientApp.prototype.startGame = function(name)
{
	sendMsg(this.connection, new StartGameMsg(name));
}