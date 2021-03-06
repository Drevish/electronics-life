function Game(gameMap, outputContext, delay, foodCountSpawnPerTurn, cellSize) {
    this.map = gameMap;				
    this.output = outputContext;
    this.delay = delay;
    this.creatures = [];
    this.foodCount = foodCountSpawnPerTurn;
    this.cellSize = cellSize;

    this.map.forEach(function(row, i) {
		row.forEach(function(symbol, j) {
			//finding creatures which are marked as "0" or "1" and pushing them to creatures array
			if (symbol == "0")
				this.creatures.push(new Herbivore(new Position(i, j)));
			if (symbol == "1")
				this.creatures.push(new Predator(new Position(i, j)));
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
			if (symbol == "0" || symbol == "1")
				this.map[i][j] = " ";
		}.bind(this));
	}.bind(this));

	this.creatures.forEach(function(creature) {
		//adding current creatures markers
		this.map[creature.position.x][creature.position.y] = creature.symbol;
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
				context.stroke();
			}

			if (symbol == "*") {
				context.beginPath();
				context.arc(i * this.cellSize + this.cellSize / 2, j * this.cellSize + this.cellSize / 2, this.cellSize / 2, 0,  Math.PI * 2);
				context.fillStyle="#FFFF2A";
				context.fill();
				context.stroke();
			}
		}.bind(this));
	}.bind(this));

	this.creatures.forEach(function(creature){
		context.beginPath();
	 	context.arc(creature.position.x * this.cellSize + this.cellSize / 2, creature.position.y * this.cellSize + this.cellSize / 2, this.cellSize / 2, 0,  Math.PI * 2);
		context.fillStyle = creature.color;
		context.fill();
		context.stroke();
	}.bind(this));
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
		this.map[creature.position.x][creature.position.y] = " ";
		creature.move();
		this.map[creature.position.x][creature.position.y] = creature.symbol;

		if (creature.isDead) {
			this.map[creature.position.x][creature.position.y] = " ";
			this.creatures.forEach(function(cr, i){
				if (cr == creature)
					this.creatures = this.creatures.slice(0, i).concat(this.creatures.slice(i + 1));
			}.bind(this));
			return;
		}

		if (creature.hasKilled && creature instanceof Predator) {
			//searching and deleting dead creature;
			this.creatures.forEach(function(killed, k) {
					if (killed.position.compare(creature.position) && killed != creature)
						this.creatures = this.creatures.slice(0, k).concat(this.creatures.slice(k + 1));
			}.bind(this));
		}

		if(creature.deliveredChild == true) {
			creature.deliveredChild = false;
			creature.energy -= 20;

			var a = creature.emptyCell;

			//no empty space nearby
			if (a == undefined) return;

			a = creature.surroundsToVector[a[0]][a[1]]; 

			if (creature instanceof Herbivore)
				this.creatures.push(new Herbivore(new Position(creature.position.x + a[0], creature.position.y + a[1])));
			if (creature instanceof Predator)
				this.creatures.push(new Predator(new Position(creature.position.x + a[0], creature.position.y + a[1])));
			
		}
	}.bind(this));

	var sumEnergy = 0;
	this.creatures.forEach(function(creature){
		sumEnergy += creature.energy;
	});

	this.spawnFood();
}

//starting game loop
Game.prototype.start = function() {
	setInterval(function() {
		this.makeMove();
		this.refreshMap();
		this.print();
	}.bind(this), this.delay);
}