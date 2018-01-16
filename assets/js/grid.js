var grid = {
    data: [],
    buildEmpty(width, height){
        utilities.devDebug('grid.buildEmpty');

        grid.buildData(width, height);
        ui.dynamicGrid.innerHTML = grid.buildSkeleton(width, height, "dynamic");
        ui.staticGrid.innerHTML = grid.buildSkeleton(width, height, "static");
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


    buildSkeleton(width, height, identifier){
        utilities.devDebug('grid.buildSkeleton: ' + identifier);

        var tempHtml = "";

        for(var y = 0; y < height; y++){
            var row = "<div class='row'>";

            for(var x = 0; x < width; x++){
                row += "<span class='cell' id='" + identifier + "-" + x + "-" + y + "'></span>";
            }

            row += "</div>";

            tempHtml += row;
        }

        return tempHtml;
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
                var cell = document.getElementById("dynamic-" + x + "-" + y);

                if(grid.data[y][x]){
                    cell.classList.add('alive');
                } else{
                    cell.classList.remove('alive');
                }
            }
        }

        if(typeof player.position !== "undefined"){
            document.querySelectorAll('.player').forEach(function(cell){
                cell.classList.remove('player');
            });

            document.getElementById("dynamic-" + player.position.x + "-" + player.position.y).classList.add('player');
        }
    },

    addCreature(creature, x, y, rotation, flipDirection){;
        var creatureData = creatures[creature].data;

        var currentRotation = 0;

        creatureData = utilities.rotateArray(creatureData, rotation);
        creatureData = utilities.flipArray(creatureData, flipDirection);

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

        grid.render();
    },

    addCell(x,y){
        grid.data[y][x] = true;
    },

    addObject(object){
        utilities.devDebug('grid.addObject');

        document.getElementById("static-" + object.x + "-" + object.y).innerHTML = svg.generate(object.type, 20, 20);
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