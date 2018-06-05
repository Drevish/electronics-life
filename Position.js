function Position(x, y) {
	this.x = x;
	this.y = y;
}

Position.prototype.compare = function(p){
	return (this.x == p.x && this.y == p.y);
}