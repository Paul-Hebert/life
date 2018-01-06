document.addEventListener("DOMContentLoaded", function() {
    life.init();
    life.startGame();
});

var settings = {
    dev: true,

    rate: 200,

    constantMovement: true,

    width:40,
    height:30,

    wrapGrid: true,

    gridTheme: ["gooey", "transition"] // Other options: ["hoveredEffects"]
};

var grid = {
    data: [],
    html: ""
};

var player = {
    lives: 3,
    points: 0
}

var resources = [];

var ui = {
    startLoopButton: document.getElementById('startLoop'),
    stopLoopButton: document.getElementById('stopLoop'),

    rateInput: document.getElementById('rate'),

    primaryGrid: document.getElementById('primaryGrid'),

    body: document.body
};

var controls = {
    bindHandlers(){
        utilities.devDebug("controls.bindHandlers");

        window.addEventListener("keydown", function(e){
            utilities.devDebug("key pressed: " + controls.keyCodes[e.keyCode]);

            e.preventDefault();

            controls.pressedKey = controls.keyCodes[e.keyCode];
        });
    },
    keyCodes: {
        "37": "left",
        "38": "up",
        "39": "right",
        "40": "down"
    },
    pressedKey: null
}

var loop = {
    active: false,

    now: null,
    dt: null,
    last: null,

    start(){
        utilities.devDebug('loop.start');

        ui.stopLoopButton.style.display = "inline";
        ui.startLoopButton.style.display = "none";

        loop.active = true;

        loop.now = null;
        loop.duration = null;
        loop.last = loop.timestamp();

        requestAnimationFrame(loop.turn);
    },

    stop(){
        utilities.devDebug('loop.stop');

        ui.stopLoopButton.style.display = "none";
        ui.startLoopButton.style.display = "inline";

        loop.active = false;
    },

    turn(){
        loop.now = loop.timestamp();
        loop.duration = loop.now - loop.last;

        if(loop.duration >= settings.rate){
            utilities.devDebug('loop.turn');

            loop.last = loop.now;
            
            life.updateGridData();

            if(player !== null){
                life.movePlayer();
            }
    
            life.renderGrid();
        }

        if(loop.active){
            requestAnimationFrame(loop.turn);
        }
    },

    timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }
};

var life = {
    currentLevel: 0,

    init(){
        utilities.devDebug('life.init');

        life.setGridSettingsUi();

        ui.startLoopButton.addEventListener('click', function() { loop.start(); });
        ui.stopLoopButton.addEventListener('click', function() { loop.stop(); });

        controls.bindHandlers();
    },

    startGame(){
        utilities.devDebug('life.startGame');

        life.currentLevel = 0;

        life.loadLevel(life.currentLevel);
    },

    setGridSettingsUi(){
        utilities.devDebug('life.getGridSettings');

        ui.rateInput.value = settings.rate;

        settings.gridTheme.forEach(function(theme){
            ui.body.classList.add(theme);
        });
    },

    getGridSettings(){
        utilities.devDebug('life.getGridSettings');

        settings.rate = ui.rateInput.value;
    },

    buildEmptyGrid(width, height){
        utilities.devDebug('life.buildEmptyGrid');

        life.buildGridData(width, height);
        life.buildGridSkeleton(width, height);
    },

    buildGridData(width, height){
        utilities.devDebug('life.buildGridData');

        grid.data = [];

        for(var y = 0; y < height; y++){
            var row = [];

            for(var x = 0; x < width; x++){
                row.push(false);
            }

            grid.data.push(row);
        }
    },

    buildGridSkeleton(width, height){
        utilities.devDebug('life.buildGridSkeleton');

        grid.html = "";

        for(var y = 0; y < height; y++){
            var row = "<div class='row'>";

            for(var x = 0; x < width; x++){
                row += "<span class='cell' id='" + x + "-" + y + "'></span>";
            }

            row += "</div>";

            grid.html += row;
        }

        ui.primaryGrid.innerHTML = grid.html;

        document.querySelectorAll('.cell').forEach(function(cell){
            cell.addEventListener('click', function() { 
                var id = cell.id.split("-");
                var x = id[0];
                var y = id[1];

                grid.data[y][x] = !grid.data[y][x];

                life.renderGrid();
            });
        });
    },

    updateGridData(){
        utilities.devDebug('life.updateGridData');

        var tempGridData = [];

        for(var y = 0; y < grid.data.length; y++){
            var row = [];

            for(var x = 0; x < grid.data[0].length; x++){
                var alive = grid.data[y][x];
                var neighborCoordinates = [];

                // Corresponds to lettered code lines below - x is the active cell
                // a|b|c
                // d|x|e
                // f|g|h

                /* a */ neighborCoordinates.push([life.checkBounds(settings.height, y - 1), life.checkBounds(settings.width, x - 1)]); // left and up
                /* b */ neighborCoordinates.push([life.checkBounds(settings.height, y - 1), x]); // top
                /* c */ neighborCoordinates.push([life.checkBounds(settings.height, y - 1), life.checkBounds(settings.width, x + 1)]); // right and up
                /* d */ neighborCoordinates.push([y, life.checkBounds(settings.width, x - 1)]); // left
                /* e */ neighborCoordinates.push([y, life.checkBounds(settings.width, x + 1)]); // right
                /* f */ neighborCoordinates.push([life.checkBounds(settings.height, y + 1), life.checkBounds(settings.width, x - 1)]); // left and down
                /* g */ neighborCoordinates.push([life.checkBounds(settings.height, y + 1), x]); // bottom
                /* h */ neighborCoordinates.push([life.checkBounds(settings.height, y + 1), life.checkBounds(settings.width, x + 1)]); // right and down

                var neighbors = [];

                neighborCoordinates.forEach(function(coordinate){
                    if(typeof grid.data[coordinate[0]] !== "undefined" && typeof grid.data[coordinate[0]][coordinate[1]] !== "undefined"){
                        neighbors.push(grid.data[coordinate[0]][coordinate[1]]);
                    }
                });

                var liveNeighbors = 0;

                neighbors.forEach(function(alive) {
                    if(alive){
                        liveNeighbors++;
                    }
                });

                if(alive){
                    if(liveNeighbors > 1 && liveNeighbors < 4){
                        row.push(true);
                    } else{
                        row.push(false);
                    }
                } else if(liveNeighbors === 3){
                    row.push(true);
                } else{
                    row.push(false);
                }
            }

            tempGridData.push(row);
        }

        grid.data = tempGridData;
    },

    renderGrid(){
        utilities.devDebug('life.renderGrid');

        for(var y = 0; y < grid.data.length; y++){
            for(var x = 0; x < grid.data[0].length; x++){
                var cell = document.getElementById(x + "-" + y);

                if(grid.data[y][x]){
                    cell.classList.add('alive');
                } else{
                    cell.classList.remove('alive');
                }
            }
        }

        if(player !== null){
            document.querySelectorAll('.player').forEach(function(cell){
                cell.classList.remove('player');
            });

            document.getElementById(player.position.x + "-" + player.position.y).classList.add('player');
        }
    },

    checkBounds(max, number){
        if(settings.wrapGrid){
            if(number >= max){
                number = 0;
            } else if(number < 0){
                number = max - 1;
            }
        }

        return number;
    },

    addCreature(creature, x, y, rotation){
        var creatureData = creatures[creature].data;
        var creatureWidth = creatureData[0].length;
        var creatureHeight = creatureData.length;

        for(yCount = 0; yCount < creatureHeight; yCount++){
            for(xCount = 0; xCount < creatureWidth; xCount++){
                var currentX = life.checkBounds(settings.width, xCount + x);
                var currentY = life.checkBounds(settings.height, yCount + y);

                if(typeof grid.data[currentY] !== "undefined" && typeof grid.data[currentY][currentX] !== "undefined"){
                    grid.data[currentY][currentX] = creatureData[yCount][xCount] === 1 ? true : false;
                }
            }
        }
    },

    addResource(resource){
        resources.push(Object.assign({}, resource));

        document.getElementById(resource.x + "-" + resource.y).classList.add('resource', resource.type);
    },

    saveGrid(){
        console.log(JSON.stringify(grid.data));
    },

    movePlayer(){
        var pos = player.position;

        if(controls.pressedKey === "left"){
            pos.x = life.checkBounds(settings.width, pos.x - 1);
        } else if(controls.pressedKey === "right"){
            pos.x = life.checkBounds(settings.width, pos.x + 1);
        } else if(controls.pressedKey === "up"){
            pos.y = life.checkBounds(settings.height, pos.y - 1);
        }else if(controls.pressedKey === "down"){
            pos.y = life.checkBounds(settings.height, pos.y + 1);
        }

        if(document.getElementById(pos.x + '-' + pos.y).classList.contains('alive')){
            document.getElementById(pos.x + '-' + pos.y).classList.add('engorged');

            player.lives --;

            if(player.lives > 0){
                alert("You're Dead! " + player.lives + " lives left.");

                loop.stop();
                life.loadLevel(life.currentLevel);
            } else{
                alert("You lose!");
                loop.stop();
            }
        }

        if(resources.length === 0){
            alert('You Win')

            life.currentLevel++;
            life.loadLevel(life.currentLevel);
        } else{
            resources.forEach(function(item, index, object){
                if(item.x === pos.x && item.y === pos.y){
                    if(item.type === "life"){
                        player.lives++;
                        console.log("Life Gained: You have " + player.lives + " lives.")
                    } else if(item.type === "point"){
                        player.points++;
                        console.log("Point Gained: You have " + player.points + " points.")
                    }
    
                    object.splice(index, 1);
                    document.getElementById(item.x + "-" + item.y).classList.remove('resource', item.type);
                }
            });
    
            if(!settings.constantMovement){
                controls.pressedKey = null;
            }
        }
    },

    loadLevel(id){
        utilities.devDebug('life.loadLevel');

        var level = levels[id];

        life.buildEmptyGrid(level.width, level.height);

        level.creatures.forEach(function(creature){
            life.addCreature(creature.name, creature.x, creature.y);
        });

        level.resources.forEach(function(resource){
            life.addResource(resource);
        });

        player.position = Object.assign({}, level.playerPosition);

        life.renderGrid();

        loop.start();
    },

    loadRandomGrid(chance, width, height){
        utilities.devDebug("life.loadRandomGrid");

        life.buildEmptyGrid(width, height);

        for(y = 0; y < height; y++){
            for(x = 0; x < width; x++){
                console.log(x,y)
                if(Math.random() > chance){
                    grid.data[y][x] = true;
                }
            }
        }

        player = null;

        life.renderGrid();
        loop.start();
    },

    randomCell(chance){
        utilities.devDebug('life.buildCell');

        return Math.random() > chance;
    },
};

var creatures = {
    blinker: {
        name: "Blinker",
        dynamic: true,
        data: [
            [1],
            [1],
            [1]
        ]
    },
    block: {
        name: "Block",
        dynamic: false,
        data: [
            [1,1],
            [1,1]
        ]
    },
    glider: {
        name: "Glider",
        dynamic: true,
        data: [
            [0,1,0],
            [0,0,1],
            [1,1,1]
        ]
    },
    lightweightSpaceship: {
        name: "Lightweight Spaceship",
        dynamic: true,
        data: [
            [0,1,0,0,1],
            [1,0,0,0,0],
            [1,0,0,0,1],
            [1,1,1,1,0]
        ]
    },
    middleweightSpaceship: {
        name: "Middleweight Spaceship",
        dynamic: true,
        data: [
            [0,0,0,1,0,0],
            [0,1,0,0,0,1],
            [1,0,0,0,0,0],
            [1,0,0,0,0,1],
            [1,1,1,1,1,0],
        ]
    },
    clock: {
        name: "Clock",
        dynamic: true,
        data: [
            [0,0,1,0],
            [1,1,0,0],
            [0,0,1,1],
            [0,1,0,0]
        ]
    },
    gun: {
        name: "Gun",
        dynamic: true,
        data: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
            [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
            [1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ]
    },
    eater: {
        name: "Eater",
        dynamic: true,
        data: [
            [1,1,0,0,0,0,0,0,0],
            [1,1,0,0,0,1,0,0,0],
            [0,0,0,0,1,0,1,0,0],
            [0,0,0,0,0,1,0,1,0],
            [0,0,0,0,0,0,0,1,0],
            [0,0,0,0,0,0,0,1,1],
        ]
    },
};

var levels = [
    {
        Name: "The Beginning",
        width:40,
        height:30,
        creatures: [
            {
                name: 'glider',
                x: 0,
                y: 0
            },
            {
                name: 'glider',
                x: 5,
                y: 0
            },
            {
                name: 'glider',
                x: 10,
                y: 0
            },
            {
                name: 'glider',
                x: 15,
                y: 0
            },
            {
                name: 'glider',
                x: 20,
                y: 0
            },
            {
                name: 'glider',
                x: 25,
                y: 0
            },
            {
                name: 'glider',
                x: 30,
                y: 0
            }
        ],
        resources: [
            {
                type:"point",
                x: 20,
                y: 0
            },
            {
                type:"life",
                x: 7,
                y: 11
            },
            {
                type:"point",
                x: 29,
                y: 28
            },
            {
                type:"point",
                x: 11,
                y: 3
            },
            {
                type:"life",
                x: 1,
                y: 13
            },
            {
                type:"point",
                x: 34,
                y: 8
            },
            {
                type:"point",
                x: 8,
                y: 18
            }
        ],
        playerPosition : {
            x: 20,
            y: 15
        }
    },
    {
        Name: "The Guns",
        width:40,
        height:30,
        creatures: [
            {
                name: 'gun',
                x: 0,
                y: 0
            },
            {
                name: 'eater',
                x: 30,
                y: 24
            },
        ],
        resources: [
            {
                type:"life",
                x: 20,
                y: 0
            },
            {
                type:"point",
                x: 7,
                y: 11
            },
            {
                type:"point",
                x: 29,
                y: 28
            },
            {
                type:"point",
                x: 11,
                y: 3
            },
            {
                type:"point",
                x: 1,
                y: 13
            },
            {
                type:"life",
                x: 34,
                y: 8
            },
            {
                type:"point",
                x: 8,
                y: 18
            }
        ],
        playerPosition : {
            x: 20,
            y: 15
        }
    },
    {
        Name: "The Mix",
        width:40,
        height:30,
        creatures: [
            {
                name: 'glider',
                x: 20,
                y: 0
            },
            {
                name: 'lightweightSpaceship',
                x: 0,
                y: 14
            },
        ],
        resources: [
            {
                type:"life",
                x: 20,
                y: 0
            },
            {
                type:"life",
                x: 7,
                y: 11
            },
            {
                type:"point",
                x: 29,
                y: 28
            },
            {
                type:"point",
                x: 11,
                y: 3
            },
            {
                type:"point",
                x: 1,
                y: 13
            },
            {
                type:"point",
                x: 34,
                y: 8
            },
            {
                type:"point",
                x: 8,
                y: 18
            }
        ],
        playerPosition : {
            x: 20,
            y: 15
        }
    },
    {
        Name: "The Glider",
        width:40,
        height:30,
        creatures: [
            {
                name: 'glider',
                x: 0,
                y: 0
            },
            {
                name: 'glider',
                x: 5,
                y: 0
            },
            {
                name: 'glider',
                x: 10,
                y: 0
            },
            {
                name: 'glider',
                x: 15,
                y: 0
            },
            {
                name: 'glider',
                x: 20,
                y: 0
            },
            {
                name: 'glider',
                x: 25,
                y: 0
            },
            {
                name: 'glider',
                x: 30,
                y: 0
            },
            {
                name: 'glider',
                x: 35,
                y: 0
            },
            {
                name: 'glider',
                x: 0,
                y: 0
            },
            {
                name: 'glider',
                x: 5,
                y: 0
            },
            {
                name: 'glider',
                x: 10,
                y: 0
            },
            {
                name: 'glider',
                x: 15,
                y: 0
            },
            {
                name: 'glider',
                x: 20,
                y: 0
            },
            {
                name: 'glider',
                x: 25,
                y: 10
            },
            {
                name: 'glider',
                x: 30,
                y: 10
            },
            {
                name: 'glider',
                x: 35,
                y: 10
            },
            {
                name: 'glider',
                x: 0,
                y: 20
            },
            {
                name: 'glider',
                x: 5,
                y: 20
            },
            {
                name: 'glider',
                x: 10,
                y: 20
            },
            {
                name: 'glider',
                x: 15,
                y: 20
            },
            {
                name: 'glider',
                x: 20,
                y: 20
            },
            {
                name: 'glider',
                x: 25,
                y: 20
            },
            {
                name: 'glider',
                x: 30,
                y: 20
            },
            {
                name: 'glider',
                x: 35,
                y: 20
            },
        ],
        resources: [
            {
                type:"point",
                x: 20,
                y: 10
            },
            {
                type:"point",
                x: 7,
                y: 21
            },
            {
                type:"point",
                x: 29,
                y: 28
            },
            {
                type:"point",
                x: 11,
                y: 3
            },
            {
                type:"point",
                x: 1,
                y: 13
            },
            {
                type:"life",
                x: 34,
                y: 8
            },
            {
                type:"life",
                x: 8,
                y: 18
            }
        ],
        playerPosition : {
            x: 20,
            y: 15
        }
    }
]

var utilities = {
    devDebug(message, table){
        if(settings.dev){
            if(table){
                console.table(message);
            } else{
                console.log(message);                
            }
        }
    }
}