function GameInfo(name, host)
{
	this.name = name;
	this.host = host;
}

function Lobby()
{
	this.gameInfoArr = [];
	this.clientNameArr = [];
}

Lobby.prototype.parseMsg = function(msg)
{
	if(msg.cmd == "AddGame")
		this.gameInfoArr.push(new GameInfo(msg.gameName, msg.gameHost));
	
	else if(msg.cmd == "RemoveGame")
		this.gameInfoArr.splice(msg.gameIndex, 1);
	
	else if(msg.cmd == "AddClient")
		this.clientNameArr.push(msg.clientName);
	
	else if(msg.cmd == "RemoveClient")
	{
		this.clientNameArr.splice(msg.clientIndex, 1);
	}
	else if(msg.cmd == "FullUpdate")
	{
		this.clientNameArr = msg.clientNameArr;
		this.gameInfoArr = msg.gameInfoArr;
	}
}