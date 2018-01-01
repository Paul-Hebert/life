document.addEventListener("DOMContentLoaded", function() {
    life.init();
});

var settings = {
    dev: false,
    startingPopulation: .6,

    rate: 60,

    width:40,
    height:30,

    wrapGrid: false,

    gridTheme: "gooey" // Other options: null
};

var grid = {
    data: [],
    html: ""
};

var ui = {
    startLoopButton: document.getElementById('startLoop'),
    stopLoopButton: document.getElementById('stopLoop'),
    resetGridButton: document.getElementById('resetGrid'),

    startingPopulationInput: document.getElementById('startingPopulation'),
    rateInput: document.getElementById('rate'),

    primaryGrid: document.getElementById('primaryGrid'),

    body: document.body
};

var loop = {
    active: false,

    start(){
        utilities.devDebug('loop.start');

        ui.stopLoopButton.style.display = "inline";
        ui.startLoopButton.style.display = "none";

        loop.active = true;

        requestAnimationFrame(loop.turn);
    },

    stop(){
        utilities.devDebug('loop.stop');

        ui.stopLoopButton.style.display = "none";
        ui.startLoopButton.style.display = "inline";

        loop.active = false;
    },

    turn(){
        life.counter++;

        if(life.counter % settings.rate === 0){
            utilities.devDebug('loop.turn')
            
            life.updateGridData();
    
            life.renderGrid();
        }

        if(loop.active){
            requestAnimationFrame(loop.turn);
        }
    }
};

var life = {
    counter: 0,

    init(){
        utilities.devDebug('life.init');

        ui.body.classList.add(settings.gridTheme);

        life.buildGrid();

        ui.startLoopButton.addEventListener('click', function() { loop.start(); });
        ui.stopLoopButton.addEventListener('click', function() { loop.stop(); });

        ui.resetGridButton.addEventListener('click', function() { life.resetGrid(); });
    },

    getGridSettings(){
        utilities.devDebug('life.getGridSettings');

        settings.rate = ui.rateInput.value;
        settings.startingPopulation = ui.startingPopulationInput.value;
    },

    resetGrid(){
        utilities.devDebug('life.resetGrid');

        loop.stop();

        life.buildGrid();
    },

    buildGrid(){
        utilities.devDebug('life.buildGrid');

        life.getGridSettings();

        life.buildGridData();
        life.buildGridSkeleton();
        life.renderGrid();
    },

    buildGridData(orgs){
        utilities.devDebug('life.buildGridData');

        grid.data = [];

        for(var y = 0; y < settings.height; y++){
            var row = [];

            for(var x = 0; x < settings.width; x++){
                row.push(life.buildCell());
            }

            grid.data.push(row);
        }

        utilities.devDebug(grid.data, true);
    },

    buildGridSkeleton(){
        utilities.devDebug('life.buildGridSkeleton');

        grid.html = "";

        for(var y = 0; y < settings.height; y++){
            var row = "<div class='row'>";

            for(var x = 0; x < settings.width; x++){
                var liveClass = grid.data[y][x] ? "alive" : "";

                row += "<span class='cell " + liveClass + "' id='" + x + "-" + y + "'></span>";
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

    buildCell(){
        utilities.devDebug('life.buildCell');

        return Math.random() > settings.startingPopulation;
    },

    updateGridData(){
        utilities.devDebug('life.updateGridData');

        var tempGridData = [];

        for(var y = 0; y < settings.height; y++){
            var row = [];

            for(var x = 0; x < settings.width; x++){
                var alive = grid.data[y][x];
                var neighborCoordinates = [];

                // Corresponds to lettered code lines below
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

        utilities.devDebug(grid.data, true);
    },

    renderGrid(){
        utilities.devDebug('life.renderGrid');

        for(var y = 0; y < settings.height; y++){
            for(var x = 0; x < settings.width; x++){
                var cell = document.getElementById(x + "-" + y);

                if(grid.data[y][x]){
                    cell.classList.add('alive');
                } else{
                    cell.classList.remove('alive');
                }
            }
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

    addCreature(creature, x, y){
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
        life.renderGrid();
    }
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
};

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