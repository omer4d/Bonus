var Player = require("./Player.js");

var Tile = require("./Tile.js");
var Board = require("./Board.js");

// ************
// * Messages *
// ************

function StartMsg(game, playerIndex)
{
	this.type = "GameUpdateMsg";
	this.cmd = "Start";
	this.dictionary =
	{
		filename : game.dictionary.filename,
		letterset : game.dictionary.letterset
	};
	
	this.player1 = 
	{
		name : game.playerArr[0].name,
		bank : game.playerArr[0].bank
	};
	
	this.player2 = 
	{
		name : game.playerArr[1].name,
		bank : game.playerArr[1].bank
	};
}

// ********
// * Game *
// ********

function Game(name, host, dictionary)
{
	var letterset = dictionary.letterset;
	var letterFreqArr = new Array();

	//For getting a letter tile at random according to the letter's frequency:
	for(var i = 0; i < letterset.length; ++i)
		for(var j = 0; j < letterset[i].value; ++j)
			letterFreqArr.push(Tile.FIRST_LETTER + i);
	
	this.letterFreqArr = letterFreqArr;
	this.playerNum = 0;
	
	this.name = name;
	this.host = host;
	this.dictionary = dictionary;
	this.board = Board.create();
	
	this.playerArr = [Player.create(), Player.create()];
	this.playerCallbackArr = [null, null];
	
	this.ongoing = false;
}

Game.prototype.getRandomTileId = function()
{
	if(Math.random() < 0.02) // One in fifty chance of getting a joker.
		return Tile.JOKER;
	
	else
	{
		var n = this.letterFreqArr.length - 1;
		return this.letterFreqArr[Math.floor(Math.random() * n + 0.01)];
	}
}

Game.prototype.start = function()
{
	this.ongoing = true;
	
	for(var i = 0; i < 8; ++i)
	{
		this.playerArr[0].bank.push(this.getRandomTileId());
		this.playerArr[1].bank.push(this.getRandomTileId());
	}
	
	this.playerCallbackArr[0](new StartMsg(this, 0));
	this.playerCallbackArr[1](new StartMsg(this, 1));
}

Game.prototype.join = function(name, callback)
{
	var i = this.playerNum;
	var player = this.playerArr[i];
	
	this.playerCallbackArr[i] = callback;
	++this.playerNum;
	
	player.name = name;
	
	if(this.playerNum == 2)
		this.start();
	
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