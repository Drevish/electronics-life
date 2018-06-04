function Creature(coordinates) {
	this.position = coordinates;
	//array of creature nearby cells
	this.surrounds = [[" ", " ", " "],
					  [" ", " ", " "], 
					  [" ", " ", " "]];
	//array used to convert surround cell position to the vector on which creature moves 
	this.surroundsToVector = [[[-1, -1], [-1, 0], [-1, 1]],
							  [[0, -1], [0, 0], [0, 1]],
							  [[1, -1], [1, 0], [1, 1]]];
}

//creature vision
Creature.prototype.scan = function(map) {
	this.surrounds.forEach(function(row, i) {
		row.forEach(function(cell, j) {
			var vector = this.surroundsToVector[i][j];
			this.surrounds[i][j] = map[this.position.x + vector[0]][this.position.y + vector[1]];
		}.bind(this));
	}.bind(this));
}

//move to a random empty space
Creature.prototype.move = function() {
	//cells which are free to move into
	var emptySurrounds = [];

	this.surrounds.forEach(function(row, i) {
		row.forEach(function(surround, j) {
			//creature can move only in " " cell
			if (surround == " ") {
				emptySurrounds.push([i, j]);
			}
		}.bind(this));
	}.bind(this));
	//deadlock, mo move
	if (emptySurrounds.length == 0) return;

	var moveNumber = Math.round( Math.random() * (emptySurrounds.length - 1));
	var vector = this.surroundsToVector[emptySurrounds[moveNumber][0]][emptySurrounds[moveNumber][1]];	
	this.position.x += vector[0];
	this.position.y += vector[1];
}