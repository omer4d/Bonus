function Letter(symbol, value)
{
	this.symbol = symbol;
	this.value = value;
}

exports.create = function(symbol, value)
{
	return new Letter(symbol, value);
}