document.addEventListener("DOMContentLoaded", function() {
    life.init();
    life.startGame();
});

var player = {
    lives: 3,
    points: 0,
    reset(position){
        player.position = Object.assign({}, position);
        player.points = 0;
        player.renderData.all();
    },
    loseLife(){
        player.lives--;
        player.renderData.lives();
    },
    gainLife(){
        player.lives++;
        player.renderData.lives();
    },
    renderData:{
        all(){
            player.renderData.lives();
            player.renderData.points();
        },
        lives(){
            ui.lives.innerHTML = player.lives;
        },
        points(){
            ui.pointsObtained.innerHTML = player.points;
            ui.totalPoints.innerHTML = levels.points;
        }
    },

    move(){
        utilities.devDebug("player.move");

        var pos = Object.assign(player.position, {});
        var oldX = pos.x;
        var oldY = pos.y;

        if(controls.pressedKey === "left"){
            pos.x = grid.checkBounds(settings.width, pos.x - 1);
        } else if(controls.pressedKey === "right"){
            pos.x = grid.checkBounds(settings.width, pos.x + 1);
        } else if(controls.pressedKey === "up"){
            pos.y = grid.checkBounds(settings.height, pos.y - 1);
        }else if(controls.pressedKey === "down"){
            pos.y = grid.checkBounds(settings.height, pos.y + 1);
        }

        if(player.points === levels.points){
            life.currentLevel++;

            if(life.currentLevel >= levels.data.length){
                alert('You Win! No More levels!');

                loop.stop();

            } else{
                alert('You Win! Loading Level ' + (life.currentLevel + 1) + ".");

                levels.load(life.currentLevel);
            }
        } else{
            var blocked = false;

            obstacles.forEach(function(item, index, object){
                grid.data[item.y][item.x] = false;

                if(pos.x === item.x && pos.y === item.y){
                    blocked = true;
                }
            });

            if(blocked){
                player.position = {
                    x: oldX,
                    y: oldY
                }
            } else{
                if(grid.data[pos.y][pos.x]){
                    player.loseLife()
        
                    if(player.lives > 0){
                        alert("You're Dead! " + player.lives + " lives left.");
        
                        loop.stop();
                        levels.load(life.currentLevel);
                    } else{
                        alert("You lose!");
                        loop.stop();
                    }
                }

                resources.forEach(function(item, index, object){
                    if(item.x === pos.x && item.y === pos.y){
                        if(item.type === "life"){
                            player.gainLife();
                            console.log("Life Gained: You have " + player.lives + " lives.")
                        } else if(item.type === "point"){
                            player.points++;
                            player.renderData.points();        
                            
                            console.log('point');
                        }
        
                        object.splice(index, 1);
                        document.getElementById("static-" + item.x + "-" + item.y).innerHTML = "";
                    }
                });
            }
    
            if(!settings.constantMovement){
                controls.pressedKey = null;
            }
        }
    },
}

var resources = [];
var obstacles = [];

var ui = {
    dynamicGrid: document.getElementById('dynamicGrid'),
    staticGrid: document.getElementById('staticGrid'),

    lives: document.getElementById('lives'),

    pointsObtained: document.getElementById('pointsObtained'),
    totalPoints: document.getElementById('totalPoints'),

    body: document.body
};

var life = {
    currentLevel: 0,

    init(){
        utilities.devDebug('life.init');

        controls.bindHandlers();

        settings.gridTheme.forEach(function(theme){
            ui.body.classList.add(theme);
        });
    },

    startGame(){
        utilities.devDebug('life.startGame');

        life.currentLevel = 0;

        levels.load(life.currentLevel);
    },

    takeTurn(){
        utilities.devDebug('life.takeTurn');

        loop.last = loop.now;
        
        grid.updateData();

        if(player !== null){
            player.move();
        }

        grid.render();
    },
};