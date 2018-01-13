var levels = {
    load(id){
        utilities.devDebug('life.loadLevel');

        var level = levels.data[id];

        grid.buildEmpty(level.width, level.height);

        level.cells.forEach(function(creature){
            grid.addCell(creature.x, creature.y);
        });


        level.creatures.forEach(function(creature){
            grid.addCreature(creature.name, creature.x, creature.y);
        });

        resources = [];
        levels.points = 0;

        level.resources.forEach(function(resource){
            grid.addObject(resource);
            resources.push(Object.assign({}, resource));

            if(resource.type === "point"){
                levels.points ++;
            }
        });

        obstacles = [];

        level.obstacles.forEach(function(obstacle){
            grid.addObject(obstacle);
            obstacles.push(Object.assign({}, obstacle));
        });

        player.reset(level.playerPosition);

        grid.render();

        loop.start();
    },
    builder: {
        currentAction(){},
        open(width, height){
            loop.stop();
            grid.buildEmpty(width, height);
            levels.builder.currentAction = levels.builder.toggleCell.bind({});

            ui.dynamicGrid.querySelectorAll('.cell').forEach(function(cell){
                cell.addEventListener('click', function(){
                    var meta = this.id.split('-');

                    var x = meta[1];
                    var y = meta[2];
                    
                    levels.builder.currentAction(x, y);

                    grid.render();
                });
            });

            ui.body.classList.add('gridBuilder');

            menus.levelBuilderMenu.build();

            loop.start();
            loop.stop();
        },
        toggleCell(x, y){
            grid.data[y][x] = grid.data[y][x] ? false : true; 
        },
        togglePoint(x, y){
            utilities.devDebug('levels.builder.togglePoint');

            levels.builder.toggleResource(x, y, 'point');
        },
        toggleLife(x, y){
            utilities.devDebug('levels.builder.toggleLife');
            levels.builder.toggleResource(x, y, 'life');
        },
        toggleResource(x, y, type){
            var populated = false;

            resources.forEach(function(item, index, object){
                if(item.x === x && item.y === y){
                    populated = true;
                    object.splice(index, 1);
                    document.getElementById("static-" + item.x + "-" + item.y).innerHTML = "";
                }
            });
            
            if(!populated){
                var resource = {
                    type: type,
                    x: x,
                    y: y
                }
                grid.addObject(resource);

                resources.push(Object.assign({}, resource));
            }
        }
    },
    data: [

        {
            name: "The Beginning",
            width:40,
            height:30,
            cells: [
                    {
                    x: 0,
                    y: 11
                },
                {
                    x: 0,
                    y: 12
                },
                {
                    x: 0,
                    y: 13
                },
            ],
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
                },
                {
                    type:"point",
                    x: 11,
                    y: 7
                }
            ],
            obstacles: [
                {
                    type : "rock",
                    x:10,
                    y:6
                },
                {
                    type : "rock",
                    x:10,
                    y:7
                },
                {
                    type : "rock",
                    x:10,
                    y:8
                },
                {
                    type : "rock",
                    x:11,
                    y:6
                },
                {
                    type : "rock",
                    x:12,
                    y:6
                },
                {
                    type : "rock",
                    x:11,
                    y:8
                },
                {
                    type : "rock",
                    x:12,
                    y:8
                },
            ],
            playerPosition : {
                x: 20,
                y: 15
            }
        },
        {
            name: "The Pulsar",
            width:30,
            height:30,
            cells: [],
            creatures: [
                {
                    name: 'pulsar',
                    x: 13,
                    y: 13
                },
            ],
            resources: [
                {
                    type:"point",
                    x: 19,
                    y: 19
                }
            ],
            obstacles: [],
            playerPosition : {
                x: 1,
                y: 1
            }
        },
        {
            name: "The Toad",
            width:30,
            height:30,
            cells: [],
            creatures: [
                {
                    name: 'toad',
                    x: 13,
                    y: 13
                },
            ],
            resources: [
                {
                    type:"point",
                    x: 19,
                    y: 19
                }
            ],
            obstacles: [],
            playerPosition : {
                x: 1,
                y: 1
            }
        },
        {
            name: "The Guns",
            width:40,
            height:30,
            cells: [],
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
                    y: 1
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
            obstacles: [],
            playerPosition : {
                x: 20,
                y: 15
            }
        },
        {
            name: "The Mix",
            width:40,
            height:30,
            cells: [],
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
            obstacles: [],
            playerPosition : {
                x: 20,
                y: 15
            }
        },
        {
            name: "The Glider",
            width:40,
            height:30,
            cells: [],
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
            obstacles: [],
            playerPosition : {
                x: 20,
                y: 15
            }
        }
    ]
};