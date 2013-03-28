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
		
		function refreshGameDiv()
		{
			angular.element(gameDiv).scope().$apply();
		}
		
		clientApp = new ClientApp(log);
		clientApp.onLobbyUpdate = refreshLobbyDiv;
		clientApp.onGameStarted = refreshGameDiv;
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
		
		$("#OpenGameButton").click(
			function()
			{
				clientApp.openGame($("#GameNameField").val());
			}
		);
		
		// ***************
		// * Controllers *
		// ***************
		
		clientNgModule.controller("LobbyCtrl", 
			function($scope)
			{
				$scope.lobby = clientApp.lobby;
				
				$scope.joinGame = function(index)
				{
					clientApp.joinGame(index);
				}
			}
		);
		
		clientNgModule.controller("GameCtrl",
			function($scope)
			{
				$scope.game = clientApp.game;
				$scope.bankIndexMat = generateMatrix(2, 4);
				
				$scope.getPlayer = function(index)
				{
					return $scope.game.playerArr[index];
				}
				
				$scope.getBankAt = function(playerIndex, bankIndex)
				{
					return $scope.game.playerArr[playerIndex].bank[bankIndex];
				}
				
				$scope.getBoard = function()
				{
					return $scope.game.board;
				}
				
				$scope.cellContent = function(index)
				{
					switch(index)
					{
						case Tile.EMPTY:
							return "";
							break;
						
						case Tile.BONUS:
							return "*";
							break;
						
						case Tile.SOLID:
							return "";
							break;
						
						case Tile.JOKER:
							return "?";
							break;
							
						case Tile.EXIT:
							return "#";
							break;
							
						default:
							return $scope.game.getSymbol(index);//dictionary.letterset[index - Tile.FIRST_LETTER].symbol;
							break;
					}
				}
				
				$scope.cellStyle = function(index)
				{
					switch(index)
					{
						case Tile.EMPTY:
							return "background-color:#54B6D1;";
							break;
						case Tile.BONUS:
							return "background-color:#CBA321;";
							break;
						case Tile.SOLID:
							return "background: transparent;";
							break;
							
						default:
							return "background-color:#A19A9D;";
							break;
					}
				}
			}
		);
	}
);