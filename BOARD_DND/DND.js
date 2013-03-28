function DND()
{
	this.targetArr = new Array();
	this.dragged = 
	{
		object : null,
		source : null,
		sourceIndex : -1,
		targetArrIndex : -1
	}
	this.dragging = false;
}
			
DND.prototype.add = function(target, onTake, onDrop, onReturn)
{
	var obj = {target : target, onTake : onTake, onDrop : onDrop, onReturn : onReturn};
	this.targetArr.push(obj);
}
			
DND.prototype.onMouseDown = function(event)
{
	var dragging = false;

	for(var i = 0; i < this.targetArr.length; ++i)
	{
		if(this.targetArr[i].target.contains(event.offsetX, event.offsetY))
		{
			var index = this.targetArr[i].target.xyToIndex(event.offsetX, event.offsetY);
			var res = this.targetArr[i].onTake(index);
						
			if(res != null)
			{
				this.dragged.object = res;
				this.dragged.source = this.targetArr[i].target;
				this.dragged.sourceIndex = index;
				this.dragged.targetArrIndex = i;
				
				dragging |= true;
			}
		}
	}
	
	this.dragging = dragging;
}
			
DND.prototype.onMouseUp = function(event)
{
	var dropped = false;

	if(this.dragging)
	{
		for(var i = 0; i < this.targetArr.length; ++i)
			if(this.targetArr[i].target.contains(event.offsetX, event.offsetY))
			{
				dropped = this.targetArr[i].onDrop(event, this.dragged);
				break;
			}
		
		if(!dropped)
			this.targetArr[this.dragged.targetArrIndex].onReturn(this.dragged);
	}
}