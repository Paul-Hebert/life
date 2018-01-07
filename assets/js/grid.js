var grid = {
    data: [],
    html: "",
    buildEmpty(width, height){
        utilities.devDebug('grid.buildEmptyGrid');

        grid.buildData(width, height);
        grid.buildSkeleton(width, height);
    },

    buildData(width, height){
        utilities.devDebug('grid.buildData');

        grid.data = [];

        for(var y = 0; y < height; y++){
            var row = [];

            for(var x = 0; x < width; x++){
                row.push(false);
            }

            grid.data.push(row);
        }
    },


    buildSkeleton(width, height){
        utilities.devDebug('grid.buildSkeleton');

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

                grid.render();
            });
        });
    },

    updateData(){
        utilities.devDebug('grid.updateData');

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

                /* a */ neighborCoordinates.push([grid.checkBounds(settings.height, y - 1), grid.checkBounds(settings.width, x - 1)]); // left and up
                /* b */ neighborCoordinates.push([grid.checkBounds(settings.height, y - 1), x]); // top
                /* c */ neighborCoordinates.push([grid.checkBounds(settings.height, y - 1), grid.checkBounds(settings.width, x + 1)]); // right and up
                /* d */ neighborCoordinates.push([y, grid.checkBounds(settings.width, x - 1)]); // left
                /* e */ neighborCoordinates.push([y, grid.checkBounds(settings.width, x + 1)]); // right
                /* f */ neighborCoordinates.push([grid.checkBounds(settings.height, y + 1), grid.checkBounds(settings.width, x - 1)]); // left and down
                /* g */ neighborCoordinates.push([grid.checkBounds(settings.height, y + 1), x]); // bottom
                /* h */ neighborCoordinates.push([grid.checkBounds(settings.height, y + 1), grid.checkBounds(settings.width, x + 1)]); // right and down

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

    saveGrid(){
        console.log(JSON.stringify(grid.data));
    },

    render(){
        utilities.devDebug('grid.render');

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

    addCreature(creature, x, y, rotation){
        var creatureData = creatures[creature].data;
        var creatureWidth = creatureData[0].length;
        var creatureHeight = creatureData.length;

        for(yCount = 0; yCount < creatureHeight; yCount++){
            for(xCount = 0; xCount < creatureWidth; xCount++){
                var currentX = grid.checkBounds(settings.width, xCount + x);
                var currentY = grid.checkBounds(settings.height, yCount + y);

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

    loadRandom(chance, width, height){
        utilities.devDebug("grid.loadRandom");

        grid.buildEmpty(width, height);

        for(y = 0; y < height; y++){
            for(x = 0; x < width; x++){
                if(Math.random() > chance){
                    grid.data[y][x] = true;
                }
            }
        }

        player = null;

        grid.render();
        loop.start();
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
};