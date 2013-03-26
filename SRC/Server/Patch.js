function generate(dest, src)
{
	var updated = false;
	
	if(src.updatedProps instanceof Array)
	{
		// Copy marked primitives and arrays:
		if(src.updatedProps.length > 0)
		{
			var updatedProps = src.updatedProps;
			updated = true;
		
			for(var i = 0; i < updatedProps.length; ++i)
			{
				var prop = updatedProps[i];
			
				if(src[prop] instanceof Array || !(src[prop] instanceof Object || src[prop] instanceof Function))
					dest[prop] = src[prop];
			}
		}
	
		src.updatedProps = [];
	
		// Copy any internal objects that have updated properties:
		for(var prop in src)
		{
			if(src[prop] instanceof Object && !(src[prop] instanceof Array))
			{
				var tmp = {};
				if(generate(tmp, src[prop]))
				{
					updated |= true;
					dest[prop] = tmp;
				}
			}
		}
	}
	
	return updated;
}

exports.create = function(src)
{
	var patch = {};
	
	if(generate(patch, src))
		return patch;
	else
		return null;
}