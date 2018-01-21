var levels = {
    load(id){
        utilities.devDebug('life.loadLevel');

        var level = levels.data[id];

        grid.buildEmpty(level.width, level.height);

        level.cells.forEach(function(creature){
            grid.addCell(creature.x, creature.y);
        });

        level.creatures.forEach(function(creature){
            grid.addCreature(creature.name, creature.x, creature.y, null, null);
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
        newLevel: {},
        currentAction(){},
        currentCreature: Object.keys(creatures)[0],
        currentRotation: 0,
        currentFlipDirection: "none",
        
        open(width, height){
            levels.builder.newLevel = {};
            levels.builder.newLevel.width = width;
            levels.builder.newLevel.height = height;

            grid.buildEmpty(width, height);

            levels.builder.newLevel.cells = [];
            levels.builder.newLevel.resources = [];
            levels.builder.newLevel.obstacles = [];
            levels.builder.newLevel.creatures = [];
            levels.builder.newLevel.playerPosition = null;
            
            levels.builder.newLevel.height = height;
            levels.builder.currentAction = levels.builder.addCell.bind({});

            ui.dynamicGrid.querySelectorAll('.cell').forEach(function(cell){
                cell.addEventListener('click', function(){
                    var meta = this.id.split('-');

                    var x = parseInt(meta[1]);
                    var y = parseInt(meta[2]);                    
                    
                    levels.builder.currentAction(x, y);

                    grid.render();
                });
            });

            ui.body.classList.add('gridBuilder');

            menus.levelBuilderMenu.build();

            loop.start();
            loop.stop();
        },
        addPlayer(x, y){
            utilities.devDebug('levels.builder.addPlayer');

            if(!levels.builder.removeCurrent(x, y)){
                var pos = {
                    x: x,
                    y: y
                };

                player.position = pos;

                levels.builder.newLevel.playerPosition = pos;
            }
        },
        addCell(x, y){
            utilities.devDebug('levels.builder.addCell');

            if(!levels.builder.removeCurrent(x, y)){
                grid.data[y][x] = true; 
            }

            levels.builder.newLevel.cells.push({
                x: x,
                y: y
            });
        },
        addPoint(x, y){
            utilities.devDebug('levels.builder.addPoint');

            if(!levels.builder.removeCurrent(x, y)){
                levels.builder.addResource(x, y, 'point');
            }
        },
        addLife(x, y){
            utilities.devDebug('levels.builder.addLife');

            if(!levels.builder.removeCurrent(x, y)){
                levels.builder.addResource(x, y, 'life');
            }
        },
        addResource(x, y, type){
            var resource = {
                type: type,
                x: x,
                y: y
            }
            grid.addObject(resource);

            levels.builder.newLevel.resources.push(Object.assign({}, resource));

            resources.push(Object.assign({}, resource));
        },
        addRock(x, y){
            utilities.devDebug('levels.builder.addRock');

            if(!levels.builder.removeCurrent(x, y)){
                levels.builder.addObstacle(x, y, 'rock');
            }
        },
        addObstacle(x, y, type){
            utilities.devDebug('levels.builder.addObstacle');
            var obstacle = {
                type: type,
                x: x,
                y: y
            }
            grid.addObject(obstacle);

            levels.builder.newLevel.obstacles.push(Object.assign({}, obstacle));

            obstacles.push(Object.assign({}, obstacle));
        },
        removeCurrent(x, y){
            var removed = false;

            resources.forEach(function(item, index, object){
                if(item.x === x && item.y === y){
                    object.splice(index, 1);
                    document.getElementById("static-" + item.x + "-" + item.y).innerHTML = "";

                    removed = true;
                }
            });

            obstacles.forEach(function(item, index, object){
                if(item.x === x && item.y === y){
                    object.splice(index, 1);
                    document.getElementById("static-" + item.x + "-" + item.y).innerHTML = "";

                    removed = true;
                }
            });

            if(grid.data[y][x]){
                removed = true;
                grid.data[y][x] = false;
            }

            return removed;
        },
        addCreature(x, y){
            grid.addCreature(levels.builder.currentCreature, x, y, levels.builder.currentRotation, levels.builder.currentFlipDirection);
            
            levels.builder.newLevel.creatures.push({
                name: levels.builder.currentCreature, 
                x: x, 
                y: y,
                rotation:0
            });
        }
    },
    data: [
        {
            "width":30,
            "height":30,
            "cells":[
               {
                  "x":0,
                  "y":19
               },
               {
                  "x":6,
                  "y":13
               },
               {
                  "x":6,
                  "y":23
               },
               {
                  "x":26,
                  "y":6
               },
               {
                  "x":20,
                  "y":8
               },
               {
                  "x":25,
                  "y":1
               },
               {
                  "x":11,
                  "y":2
               }
            ],
            "resources":[
               {
                  "type":"point",
                  "x":10,
                  "y":19
               },
               {
                  "type":"point",
                  "x":17,
                  "y":20
               },
               {
                  "type":"point",
                  "x":18,
                  "y":12
               },
               {
                  "type":"point",
                  "x":26,
                  "y":10
               },
               {
                  "type":"point",
                  "x":19,
                  "y":3
               },
               {
                  "type":"point",
                  "x":26,
                  "y":20
               },
               {
                  "type":"point",
                  "x":5,
                  "y":12
               },
               {
                  "type":"point",
                  "x":11,
                  "y":4
               },
               {
                  "type":"point",
                  "x":7,
                  "y":25
               },
               {
                  "type":"point",
                  "x":18,
                  "y":25
               },
               {
                  "type":"life",
                  "x":16,
                  "y":23
               },
               {
                  "type":"life",
                  "x":24,
                  "y":5
               },
               {
                  "type":"life",
                  "x":7,
                  "y":2
               }
            ],
            "obstacles":[
         
            ],
            "creatures":[
               {
                  name:"glider",
                  x:13,
                  y:2
               },
               {
                  name:"glider",
                  x:23,
                  y:5
               },
               {
                  type:"middleweightSpaceship",
                  x:1,
                  y:24
               }
            ],
            "playerPosition":{
               "x":10,
               "y":10
            }
         },
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