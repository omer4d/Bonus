function BoardView(tileset, cols, rows, x, y, hspace, vspace, getTileId, setTileId)
{
	this.tileset = tileset;
	this.cols = cols
	this.rows = rows;
	this.minx = x;
	this.miny = y;
	this.hspace = hspace;
	this.vspace = vspace;
	this.maxx = x + cols * (tileset.tw + hspace) - hspace;
	this.maxy = y + rows * (tileset.th + vspace) - vspace; 
	this.getTileId = getTileId;
	this.setTileId = setTileId;
}
					
BoardView.prototype.draw = function(context)
{
	var tileset = this.tileset;
	var tw = this.tileset.tw, th = this.tileset.th;
	var hspace = this.hspace, vspace = this.vspace;
	var c = 0;
					
	for(var j = 0; j < this.rows; ++j)
		for(var i = 0; i < this.cols; ++i)
		{
			var tileId = this.getTileId(c++);
								
			if(tileId >= Tile.EMPTY)
				tileset.drawTile(context, this.minx + i * (tw + hspace), this.miny + j * (th + vspace), tileId - Tile.JOKER);
		}
}

BoardView.prototype.contains = function(x, y)
{
	if(x < this.minx || y < this.miny || x >= this.maxx || y >= this.maxy)
		return false;
	
	// Check if it's in one of the gaps:
	var i = Math.floor((x - this.minx) / (this.maxx - this.minx + this.hspace) * this.cols);
	var j = Math.floor((y - this.miny) / (this.maxy - this.miny + this.vspace) * this.rows);
	var tx = this.minx + i * (this.tileset.tw + this.hspace);
	var ty = this.miny + j * (this.tileset.th + this.vspace);
	
	if(x - tx > this.tileset.tw || y - ty > this.tileset.th)
		return false;
	
	return true;
}

BoardView.prototype.xyToIndex = function(x, y)
{
	var i = Math.floor((x - this.minx) / (this.maxx - this.minx + this.hspace) * this.cols);
	var j = Math.floor((y - this.miny) / (this.maxy - this.miny + this.vspace) * this.rows);
	
	return j * this.cols + i;
}

BoardView.prototype.indexToXy = function(index)
{
	var j = Math.floor(index / this.cols), i = index % this.cols;
	var x = this.minx + (this.tileset.tw + this.hspace) * i;
	var y = this.miny + (this.tileset.th + this.vspace) * j;
	return {x : x, y : y};
}