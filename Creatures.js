function Predator(position) {
	Creature.call(this, position);
	this.food = "0";
	this.symbol = "1";
	this.color = "#FF0000";
}
Predator.prototype = Object.create(Creature.prototype);

function Herbivore(position) {
	Creature.call(this, position);
	this.food = "*";
	this.symbol = "0";
	this.color = "#00FF00";
}
Herbivore.prototype = Object.create(Creature.prototype);