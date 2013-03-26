$(	
	function()
	{
		var clientNgModule = angular.module("ClientNgModule", []);
		
		var connectDiv = $("#ConnectDiv"); 
		var logDiv = $("#LogDiv");
		var lobbyDiv = $("#LobbyDiv");
		var gameDiv = $("#GameDiv");
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
		clientApp.onJoinedGame = function()
		{
			lobbyDiv.hide();
			gameDiv.show();
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
		
		clientNgModule.controller("GameCtrl",
			function($scope)
			{
				$scope.client = clientApp.client;
				$scope.cellStyle = function(index)
				{
					switch(index)
					{
						case 1:
							return "background-color:#54B6D1;";
							break;
						case 2:
							return "background-color:#CBA321;";
							break;
						default:
							return "background: transparent;";
							break;
					}
				}
			}
		);
	}
);