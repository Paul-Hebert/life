document.addEventListener("DOMContentLoaded", function() {
    life.init();
});

var settings = {
    dev: false,
    startingPopulation: .6,
}

var life = {
    counter: 0,
    rate: 60,

    gridData: [],
    gridHtml: "",
    width:120,
    height:120,

    ui:{
        startLoopButton: document.getElementById('startLoop'),
        stopLoopButton: document.getElementById('stopLoop'),
        resetGridButton: document.getElementById('resetGrid'),

        startingPopulationInput: document.getElementById('startingPopulation'),
        rateInput: document.getElementById('rate')
    },

    init: function(){
        life.devDebug('life.init');

        life.buildGrid();

        life.ui.startLoopButton.addEventListener('click', function() { life.loop.start(); });
        life.ui.stopLoopButton.addEventListener('click', function() { life.loop.stop(); });

        life.ui.resetGridButton.addEventListener('click', function() { life.resetGrid(); });
    },

    getGridSettings(){
        life.devDebug('life.getGridSettings');

        life.rate = life.ui.rateInput.value;
        settings.startingPopulation = life.ui.startingPopulationInput.value;
    },

    resetGrid(){
        life.devDebug('life.resetGrid');

        life.loop.stop();

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

        life.gridData = [];

        for(var y = 0; y < life.height; y++){
            var row = [];

            for(var x = 0; x < life.width; x++){
                row.push(life.buildcell());
            }

            life.gridData.push(row);
        }

        life.devDebug(life.gridData, true);
    },

    buildGridSkeleton(){
        life.devDebug('life.buildGridSkeleton');

        life.gridHtml = "";

        for(var y = 0; y < life.height; y++){
            var row = "<div class='row'>";

            for(var x = 0; x < life.width; x++){
                var liveClass = life.gridData[y][x] ? "alive" : "";

                row += "<span class='cell " + liveClass + "' data-x='" + x + "' data-y='" + y + "'></span>";
            }

            row += "</div>";

            life.gridHtml += row;
        }

        life.devDebug(life.gridHtml);
    },

    buildcell(){
        life.devDebug('life.buildcell');

        return Math.random() > settings.startingPopulation;
    },

    updateGridData(){
        life.devDebug('life.updateGridData');

        var tempGridData = [];

        for(var y = 0; y < life.height; y++){
            var row = [];

            for(var x = 0; x < life.width; x++){
                var alive = life.gridData[y][x];
                var neighbors = [];
                var liveNeighbors = 0;

                neighbors.push(life.gridData[life.checkBounds(life.height, y - 1)][life.checkBounds(life.width, x - 1)]); // left and up
                neighbors.push(life.gridData[y][life.checkBounds(life.width, x - 1)]); // left
                neighbors.push(life.gridData[life.checkBounds(life.height, y + 1)][life.checkBounds(life.width, x - 1)]); // left and down
                neighbors.push(life.gridData[y][life.checkBounds(life.width, x + 1)]); // right
                neighbors.push(life.gridData[life.checkBounds(life.height, y - 1)][life.checkBounds(life.width, x + 1)]); // right and up
                neighbors.push(life.gridData[life.checkBounds(life.height, y + 1)][x]) // bottom
                neighbors.push(life.gridData[life.checkBounds(life.height, y + 1)][life.checkBounds(life.width, x + 1)]); // right and down
                neighbors.push(life.gridData[life.checkBounds(life.height, y - 1)][x]) // top

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

        life.gridData = tempGridData;

        life.devDebug(life.gridData, true);
    },

    updateGridHtml(){
        life.devDebug('life.updateGridHtml');

        for(var y = 0; y < life.height; y++){
            for(var x = 0; x < life.width; x++){
            }
        }
    },

    renderGrid(){
        life.devDebug('life.renderGrid');

        document.getElementById('grid').innerHTML = life.gridHtml;

        document.querySelectorAll('.cell').forEach(function(cell){
            cell.addEventListener('click', function() { 
                var x = cell.getAttribute('data-x');
                var y = cell.getAttribute('data-y');

                life.gridData[y][x] = !life.gridData[y][x];

                life.buildGridSkeleton();
                life.renderGrid();
            });
        });
    },

    loop: {
        active: false,

        start: function(){
            life.devDebug('life.loop.start');

            life.loop.active = true;

            requestAnimationFrame(life.turn);
        },

        stop: function(){
            life.devDebug('life.loop.stop');

            life.loop.active = false;
        }
    },

    turn: function(){
        life.counter++;

        if(life.counter % life.rate === 0){
            life.devDebug('life.turn')
            
            life.updateGridData();
            life.buildGridSkeleton();
    
            life.renderGrid();
        }

        if(life.loop.active){
            requestAnimationFrame(life.turn);
        }
    },

    devDebug: function(message, table){
        if(settings.dev){
            if(table){
                console.table(message);
            } else{
                console.log(message);                
            }
        }
    },

    checkBounds(max, number){
        if(number >= max){
            number = 0;
        } else if(number < 0){
            number = max - 1;
        }

        return number;
    }
}