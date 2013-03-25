var Player = require("./Player.js");

var Tileset = require("./Tileset.js");
var Board = require("./Board.js");

//
//
//

function Game(name, host, dictionary)
{
	this.playerNum = 0;
	
	this.name = name;
	this.host = host;
	this.dictionary = dictionary;
	this.board = Board.create(11, 11, Tileset.create(dictionary.charset));
	
	this.player1 = Player.create();
	this.player2 = Player.create();
	
	this.player1Callback = null;
	this.player2Callback = null;
	
	this.ongoing = false;
}

Game.prototype.join = function(callback)
{
	++this.playerNum;
	switch(this.playerNum)
	{
		case 1:
			this.player1Callback = callback;
			return this.player1;
			
		case 2:
			this.player2Callback = callback;
			return this.player2;
		default:
			return null;
	}
}

Game.prototype.parseMsg = function(player, msg)
{
	
}

// ***********
// * Exports *
// ***********

exports.create = function(dictionary)
{
	return new Game(dictionary);
}