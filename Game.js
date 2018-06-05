function Game(gameMap, outputContext, delay, foodCountSpawnPerTurn, cellSize, creaturesCount) {
    this.map = gameMap;				
    this.output = outputContext;
    this.delay = delay;
    this.creatures = [];
    this.foodCount = foodCountSpawnPerTurn;
    this.cellSize = cellSize;
    this.creaturesCount = creaturesCount;

    this.map.forEach(function(row, i) {
		row.forEach(function(symbol, j) {
			if (symbol == "0") {
				//finding creatures which are marked as "0" and pushing them to creatures array
				this.creatures.push(new Creature(new Position(i, j)));
			}
		}.bind(this));
	}.bind(this));

    //canvas initializing
    this.output.setAttribute("width",  map.length * this.cellSize);
    this.output.setAttribute("height",  map[0].length * this.cellSize);
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
	this.output.width = this.output.width;
	var context = this.output.getContext("2d");
	
	this.map.forEach(function(row, i) {
		row.forEach(function(symbol, j) {
			if (symbol == "#") {
				context.fillStyle="#000000";
				context.fillRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
			}

			if (symbol == "0") {
				context.beginPath();
				context.arc(i * this.cellSize + this.cellSize / 2, j * this.cellSize + this.cellSize / 2, this.cellSize / 2, 0,  Math.PI * 2);
				context.fillStyle="#00FF00";
				context.fill();
			}

			if (symbol == "*") {
				context.beginPath();
				context.arc(i * this.cellSize + this.cellSize / 2, j * this.cellSize + this.cellSize / 2, this.cellSize / 2, 0,  Math.PI * 2);
				context.fillStyle="#FFFF2A";
				context.fill();
			}
		}.bind(this));
		this.output.innerHTML += "<br>";
	}.bind(this));
}

//starting game loop
Game.prototype.start = function() {
	console.log(this);
	setInterval(function() {
		this.makeMove();
		this.refreshMap();
		this.print();
	}.bind(this), this.delay);
}

Game.prototype.purgeCell = function(pos){
	this.map[pos.x][pos.y] = " ";
}

Game.prototype.spawnFood = function() {
	var emptyCells = [];

	this.map.forEach(function(row, i) {
		row.forEach(function(cell, j) {
			if (cell == " ")
				emptyCells.push([i, j]);
		}.bind(this));
	}.bind(this));

	//deadlock
	if (emptyCells.length == 0) return;

	for(var i = 0; i < this.foodCount; i++) {
		var moveNumber = Math.floor( Math.random() * emptyCells.length);
		var cell = emptyCells[moveNumber];
		this.map[cell[0]][cell[1]] = "*";
	}
}

//calculation of every creature move
Game.prototype.makeMove = function() {
	this.creatures.forEach(function(creature, counter) {
		//we have to give map to our creature in order to it could scan nearby cells
		creature.scan(this.map);
		creature.move();

		if (creature.isDead) {
			this.purgeCell(creature.position);
			this.creatures = arrayDeleteElement(this.creatures, counter);
		}
		if(creature.deliveredChild) {
			creature.deliveredChild = false;
			creature.energy -= 20;
			this.creatures.push(new Creature(new Position(creature.position.x, creature.position.y)));
		}
	}.bind(this));

	this.spawnFood();
}