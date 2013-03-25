$(	
	function()
	{
		var log = $("#log");
		var clientApp = angular.module("ClientApp", []);
		var client = {};
		var lobby = new Lobby();
		
		// ***************
		// * Controllers *
		// ***************
		
		function refreshLobbyDiv()
		{
			angular.element($("#LobbyDiv")).scope().$apply();
		}
		
		clientApp.controller("LobbyCtrl", 
			function($scope)
			{
				$scope.lobby = lobby;
			}
		);
		
		// *****************
		// * Websock stuff *
		// *****************
		
		window.WebSocket = window.WebSocket || window.MozWebSocket;
 
		if(!window.WebSocket)
		{
			log.append("Browser doesn't support WebSock!");
			return;
		}
		
		var connection = new WebSocket("ws://127.0.0.1:666");

		// ****************************
		// * Message handling helpers *
		// ****************************
		
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
		}
		
		function handleModelUpdate(msg)
		{
			if(msg.modelName == "client")
				applyPatch(client, msg.patch);
		}
		
		// *****************************
		// * Connection event handling *
		// *****************************
		
		connection.onopen = function()
		{
			log.append("Connected successfully!");
		}
		
		connection.onerror = function(error)
		{
			log.append("Can't connect: " + error);
		}
		
		connection.onmessage = function(raw)
		{
			log.append("MSG!");
		
			try
			{
				var msg = JSON.parse(raw.data);
			}
			catch(e)
			{
				log.append("Received corrupted message: " + raw.data);
				return;
			}
			
			if(msg.type == "modelUpdate")
			{
				log.append("Received model update!");
				handleModelUpdate(msg);
				log.append(client.name);
			}
			
			else if(msg.type == "LobbyMsg")
			{
				lobby.parseMsg(msg);
				refreshLobbyDiv();
			}
		}
		
		setInterval(
			function()
			{
				if(connection.readyState !== 1)
					log.append("Retrying...");
			}
		, 3000);
	}
);