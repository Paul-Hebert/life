var levels = {
    load(id){
        utilities.devDebug('life.loadLevel');

        var level = levels.data[id];

        grid.buildEmpty(level.width, level.height);

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
    data: [
        {
            Name: "The Pulsar",
            width:30,
            height:30,
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
            Name: "The Toad",
            width:30,
            height:30,
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
            obstacles: [],
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
            obstacles: [],
            playerPosition : {
                x: 20,
                y: 15
            }
        }
    ]
};