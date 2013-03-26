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
	
	this.playerArr = [Player.create(), Player.create()];
	this.playerCallbackArr = [null, null];
	
	this.ongoing = false;
}

Game.prototype.join = function(callback)
{
	var i = this.playerNum;
	var player = this.playerArr[i];
	
	this.playerCallback[i] = callback;
	++this.playerNum;
	
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