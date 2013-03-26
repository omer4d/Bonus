$(	
	function()
	{
		var clientNgModule = angular.module("ClientNgModule", []);
		
		var connectDiv = $("#ConnectDiv"); 
		var logDiv = $("#LogDiv");
		var lobbyDiv = $("#LobbyDiv");
		var gameDiv = $("#GameDiv");
		var clientApp = null;
		
		function generateMatrix(w, h)
		{
			var mat = new Array();
			var c = 0;
			
			for(var j = 0; j < h; ++j)
			{
				mat[j] = new Array();
				for(var i = 0; i < w; ++i, ++c)
					mat[j][i] = c;
			}
			
			return mat;
		}
		
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
				$scope.bankIndexMat = generateMatrix(2, 4);
				
				$scope.getPlayer = function(index)
				{
					return $scope.client.game.playerArr[index];
				}
				
				$scope.getBoard = function()
				{
					return $scope.client.game.board;
				}
				
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