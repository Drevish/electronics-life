var game;

var width;
var height;
var cell_size;
var delay;
var creatures_count;
var food_spawn_per_turn;

var gameOutput = document.getElementsByTagName("canvas")[0];

var map = [];/*
    ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ["#", " ", " ", "#", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
    ["#", " ", " ", " ", "0", " ", "#", " ", "#", " ", " ", " ", "#", " ", " ", " ", "#", " ", "#"],
    ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
    ["#", " ", " ", " ", " ", "#", "#", " ", " ", " ", "#", " ", " ", " ", " ", "#", " ", " ", "#"],
    ["#", " ", " ", " ", " ", "#", "#", " ", " ", "0", "#", " ", " ", " ", " ", "#", "#", " ", "#"],
    ["#", " ", " ", "0", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
    ["#", " ", " ", " ", "#", " ", " ", " ", "#", "#", " ", " ", " ", "#", " ", " ", "#", " ", "#"],
    ["#", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", "#"],
    ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"]
];*/

function createMap(){
    var form = document.forms["map"];
    width = form["width"].value;
    height = form["height"].value;
    cell_size = form["cell-size"].value;
    delay = form["delay"].value;

    creatures_count = form["creatures-count"].value;
    food_spawn_per_turn = form["food-spawn-per-turn"].value;

    form.setAttribute("hidden","true");

    generateMap();
    game = new Game(map, gameOutput, delay, food_spawn_per_turn, cell_size, creatures_count);
    game.start();   
}

var emptyCells;
function generateMap(){
    //borders
    for(var i = 0; i < height; i++) {
        map[i] = [];
        for(var j = 0; j < width; j++) {
            map[i][j] = " ";
            if (i == 0 || j == 0 || i == height - 1 || j == width - 1)
                map[i][j] = "#";       
        }   
    }

    emptyCells = [];
    map.forEach(function(row, i) {
        row.forEach(function(symbol, j) {
            if (symbol == " ")
                emptyCells.push([i, j]);
        });
    });
    
    //10% of walls
    var wallsCount = Math.floor(width*height / 10);
    for (var i = 0; i < wallsCount; i++)
        spawnRandom("#");

    for (var i = 0; i < creatures_count; i++)
        spawnRandom("0");
}

function spawnRandom(symbol){
    var newCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    map[newCell[0]][newCell[1]] = symbol;
    emptyCells = arrayDeleteElement(emptyCells, newCell);
    console.log(map);
}