function ImageLib(sourceDict, callback)
{
	var rem = 0;
						
	for(var name in sourceDict)
	{
		++rem;
	}
						
	function loaded()
	{
		--rem;
		if(!rem)
			callback();
	}
						
	for(var name in sourceDict)
	{
		var img = new Image();
		img.src = sourceDict[name];
		img.onload = loaded;
		this[name] = img;
	}
}