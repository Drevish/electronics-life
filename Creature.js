function Creature(coordinates) {
	this.position = coordinates;
	this.energy = 10; //start energy
	//creature need 1 energy to make move, and gets 10 when eats food
    this.isDead = false;
    this.deliveredChild = false;
    this.emptyCell;
	this.hasKilled = false;

	//array of creature nearby cells
	this.surrounds = [[" ", " ", " "],
					  [" ", " ", " "], 
					  [" ", " ", " "]];
	//array used to convert surround cell position to the vector on which creature moves 
	this.surroundsToVector = [[[-1, -1], [-1, 0], [-1, 1]],
							  [[0, -1], [0, 0], [0, 1]],
							  [[1, -1], [1, 0], [1, 1]]];

	//overrided properties
	this.food;
	this.symbol;
	this.color;
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

Creature.prototype.findEmptyCell = function(){
	this.surrounds.forEach(function(row, i){
		row.forEach(function(cell, j){
			if (cell == " ") {
				a = [i, j];
				this.emptyCell = a;
				return;
			}
		}.bind(this));
	}.bind(this));
}

//move to a random empty space
Creature.prototype.move = function() {
	this.hasKilled = false;
	this.emptyCell = undefined;

	//death
	if (this.energy <= 0) {
		this.isDead = true;
		return;
	}

	this.energy--;

	//cells which are free to move into
	var emptySurrounds = [];
	var foodCell = null;

	this.surrounds.forEach(function(row, i) {
		row.forEach(function(surround, j) {
			//creature can move only in " " cell
			if (surround == " ") {
				emptySurrounds.push([i, j]);
			}

			//food found, instant eat
			if (surround == this.food) {
				foodCell = [i,j];
			}

		}.bind(this));
	}.bind(this));

	//reproduction (division on 2 cells)
	if (this.energy >= 30) {
		this.deliveredChild = true;
		
		//creature doesn't move when delivers child
		if(emptySurrounds.length != 0) {
			this.emptyCell = emptySurrounds[Math.floor(Math.random() * emptySurrounds.length)];
			return;
		}
	}

	if (foodCell) {
		var newCell = foodCell;
		this.energy += 10;
		this.hasKilled = true;
	}
	else{
		//deadlock, mo move
		if (emptySurrounds.length == 0) return;
		var newCell = emptySurrounds[Math.floor(Math.random() * emptySurrounds.length)];
	}

	var vector = this.surroundsToVector[newCell[0]][newCell[1]];	
	this.position.x += vector[0];
	this.position.y += vector[1];
}