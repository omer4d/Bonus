$(	
	function()
	{
		var clientNgModule = angular.module("ClientNgModule", []);
		
		var connectDiv = $("#ConnectDiv"); 
		var logDiv = $("#LogDiv");
		var lobbyDiv = $("#LobbyDiv");
		var clientApp = null;
		
		function log(msg)
		{
			logDiv.append(msg + "<br/>");
		}
		
		function refreshLobbyDiv()
		{
			angular.element(lobbyDiv).scope().$apply();
		}
		
		clientApp = new ClientApp(log);
		clientApp.onLobbyUpdate = refreshLobbyDiv;
		clientApp.onConnectionOpen = function()
		{
			lobbyDiv.show();
			connectDiv.hide();
		}
		
		$("#ConnectButton").click(
			function()
			{
				clientApp.connect($("#ClientNameField").val());
			}
		);
		
		$("#StartGameButton").click(
			function()
			{
				$("#StartGameButton").prop("disabled", true);
				clientApp.startGame($("#GameNameField").val());
			}
		);
		
		// ***************
		// * Controllers *
		// ***************
		
		clientNgModule.controller("LobbyCtrl", 
			function($scope)
			{
				$scope.lobby = clientApp.lobby;
			}
		);
		
		clientNgModule.controller("ClientCtrl",
			function($scope)
			{
				$scope.client = clientApp.client;
			}
		);
	}
);