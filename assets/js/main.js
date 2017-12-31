document.addEventListener("DOMContentLoaded", function() {
    life.init();
});

var settings = {
    dev: false,
    startingPopulation: .6,

    rate: 60,

    width:30,
    height:30,

    wrapGrid: true,

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
        life.devDebug('loop.start');

        ui.stopLoopButton.style.display = "inline";
        ui.startLoopButton.style.display = "none";

        loop.active = true;

        requestAnimationFrame(loop.turn);
    },

    stop(){
        life.devDebug('loop.stop');

        ui.stopLoopButton.style.display = "none";
        ui.startLoopButton.style.display = "inline";

        loop.active = false;
    },

    turn(){
        life.counter++;

        if(life.counter % settings.rate === 0){
            life.devDebug('loop.turn')
            
            life.updateGridData();
            life.buildGridSkeleton();
    
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
        life.devDebug('life.init');

        ui.body.classList.add(settings.gridTheme);

        life.buildGrid();

        ui.startLoopButton.addEventListener('click', function() { loop.start(); });
        ui.stopLoopButton.addEventListener('click', function() { loop.stop(); });

        ui.resetGridButton.addEventListener('click', function() { life.resetGrid(); });
    },

    getGridSettings(){
        life.devDebug('life.getGridSettings');

        settings.rate = ui.rateInput.value;
        settings.startingPopulation = ui.startingPopulationInput.value;
    },

    resetGrid(){
        life.devDebug('life.resetGrid');

        loop.stop();

        life.buildGrid();
    },

    buildGrid(){
        life.devDebug('life.buildGrid');

        life.getGridSettings();

        life.buildGridData();
        life.buildGridSkeleton();
        life.renderGrid();
    },

    buildGridData(orgs){
        life.devDebug('life.buildGridData');

        grid.data = [];

        for(var y = 0; y < settings.height; y++){
            var row = [];

            for(var x = 0; x < settings.width; x++){
                row.push(life.buildCell());
            }

            grid.data.push(row);
        }

        life.devDebug(grid.data, true);
    },

    buildGridSkeleton(){
        life.devDebug('life.buildGridSkeleton');

        grid.html = "";

        for(var y = 0; y < settings.height; y++){
            var row = "<div class='row'>";

            for(var x = 0; x < settings.width; x++){
                var liveClass = grid.data[y][x] ? "alive" : "";

                row += "<span class='cell " + liveClass + "' data-x='" + x + "' data-y='" + y + "'></span>";
            }

            row += "</div>";

            grid.html += row;
        }

        life.devDebug(grid.html);
    },

    buildCell(){
        life.devDebug('life.buildCell');

        return Math.random() > settings.startingPopulation;
    },

    updateGridData(){
        life.devDebug('life.updateGridData');

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

        life.devDebug(grid.data, true);
    },

    updateGridHtml(){
        life.devDebug('life.updateGridHtml');

        for(var y = 0; y < settings.height; y++){
            for(var x = 0; x < settings.width; x++){
            }
        }
    },

    renderGrid(){
        life.devDebug('life.renderGrid');

        ui.primaryGrid.innerHTML = grid.html;

        document.querySelectorAll('.cell').forEach(function(cell){
            cell.addEventListener('click', function() { 
                var x = cell.getAttribute('data-x');
                var y = cell.getAttribute('data-y');

                grid.data[y][x] = !grid.data[y][x];

                life.buildGridSkeleton();
                life.renderGrid();
            });
        });
    },

    devDebug(message, table){
        if(settings.dev){
            if(table){
                console.table(message);
            } else{
                console.log(message);                
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
    }
};

var creatures = [
    {
        name: "Blinker",
        dynamic: true,
        data: [
            [true],
            [true],
            [true]
        ]
    },
    {
        name: "Block",
        dynamic: false,
        data: [
            [true, true],
            [true, true]
        ]
    },
    {
        name: "Glider",
        dynamic: true,
        data: [
            [false, true, false],
            [false, false, true],
            [true, true, true]
        ]
    },
    {
        name: "Clock",
        dynamic: true,
        data: [
            [false, false, true, false],
            [true, true, false, false],
            [false, false, true, true],
            [false, true, false, false]
        ]
    }
];