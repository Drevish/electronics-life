function Game(gameMap, outputContext, delay) {
    this.map = gameMap;				
    this.output = outputContext;
    this.delay = delay;
    this.creatures = [];

    this.map.forEach(function(row, i) {
		row.forEach(function(symbol, j) {
			if (symbol == "0") {
				//finding creatures which are marked as "0" and pushing them to creatures array
				this.creatures.push(new Creature(new Position(i, j)));
			}
		}.bind(this));
	}.bind(this));
}

//refreshing map when position of creatures has changed
Game.prototype.refreshMap = function() {
	this.map.forEach(function(row, i) {
		row.forEach(function(symbol, j) {
			//deleting old creatures markers
			if (symbol == "0")
				this.map[i][j] = " ";
		}.bind(this));
	}.bind(this));

	this.creatures.forEach(function(creature) {
		//adding current creatures markers
		this.map[creature.position.x][creature.position.y] = "0";
	}.bind(this));
}

//printing an image or text of a map to browser
Game.prototype.print = function() {
	this.output.innerHTML = "";
	this.map.forEach(function(row) {
		row.forEach(function(symbol) {
			this.output.innerHTML += symbol;
		}.bind(this));
		this.output.innerHTML += "<br>";
	}.bind(this));
}

//starting game loop
Game.prototype.start = function() {
	setInterval(function() {
		this.makeMove();
		this.refreshMap();
		this.print();
	}.bind(this), this.delay);
}

//calculation of every creature move
Game.prototype.makeMove = function() {
	this.creatures.forEach(function(creature) {
		//we have to give map to our creature in order to it could scan nearby cells
		creature.scan(this.map);
		creature.move();
	});
}