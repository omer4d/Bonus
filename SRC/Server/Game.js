var Player = require("./Player.js");

var Tileset = require("./Tileset.js");
var Board = require("./Board.js");

// ************
// * Messages *
// ************

function GameStartedMsg()
{
	
}

// ********
// * Game *
// ********

function Game(name, host, dictionary)
{
	this.playerNum = 0;
	
	this.name = name;
	this.host = host;
	this.dictionary = dictionary;
	this.board = Board.create(Tileset.create(dictionary.charset));
	
	this.playerArr = [Player.create(), Player.create()];
	this.playerCallbackArr = [null, null];
	
	this.ongoing = false;
}

// Returns a stripped-down game object for the ClientApp:
Game.prototype.stub = function()
{
	return	{
				dictionary :
				{
					filename : this.dictionary.filename,
					charset  : this.dictionary.charset
				},
				
				board : this.board,
				playerArr : this.playerArr
			};
}

Game.prototype.join = function(name, callback)
{
	var i = this.playerNum;
	var player = this.playerArr[i];
	
	this.playerCallbackArr[i] = callback;
	++this.playerNum;
	
	player.name = name;
	return player;
}

Game.prototype.parseMsg = function(player, msg)
{
	
}

// ***********
// * Exports *
// ***********

exports.create = function(name, host, dictionary)
{
	return new Game(name, host, dictionary);
}