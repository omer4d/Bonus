function Letter(symbol, freq)
{
	this.symbol = symbol;
	this.freq = freq;
	this.value = Math.floor(1.0 + (1.0 - freq) * 10.0);
}

exports.create = function(symbol, freq)
{
	return new Letter(symbol, freq);
}