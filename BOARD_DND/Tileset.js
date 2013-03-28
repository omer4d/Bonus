function Tileset(image, cols, rows)
{
	this.cols = cols;
	this.cows = rows;
	this.tw = Math.floor(image.width / cols);
	this.th = Math.floor(image.height / rows);
	this.image = image;
}
				
Tileset.prototype.drawTile = function(context, x, y, index)
{
	var tw = this.tw, th = this.th;
	var j = Math.floor(index / this.cols), i = index % this.cols;
	context.drawImage(this.image, tw * i, th * j, tw, th, x, y, tw, th);
}