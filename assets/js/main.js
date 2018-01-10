document.addEventListener("DOMContentLoaded", function() {
    life.init();
    life.startGame();
});

var player = {
    lives: 3,
    points: 0
}

var resources = [];

var ui = {
    dynamicGrid: document.getElementById('dynamicGrid'),
    staticGrid: document.getElementById('staticGrid'),

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
            life.movePlayer();
        }

        grid.render();
    },

    movePlayer(){
        utilities.devDebug("life.movePlayer");

        var pos = player.position;

        if(controls.pressedKey === "left"){
            pos.x = grid.checkBounds(settings.width, pos.x - 1);
        } else if(controls.pressedKey === "right"){
            pos.x = grid.checkBounds(settings.width, pos.x + 1);
        } else if(controls.pressedKey === "up"){
            pos.y = grid.checkBounds(settings.height, pos.y - 1);
        }else if(controls.pressedKey === "down"){
            pos.y = grid.checkBounds(settings.height, pos.y + 1);
        }

        if(grid.data[pos.y][pos.x]){
            player.lives --;

            if(player.lives > 0){
                alert("You're Dead! " + player.lives + " lives left.");

                loop.stop();
                levels.load(life.currentLevel);
            } else{
                alert("You lose!");
                loop.stop();
            }
        }

        if(life.points === 0){
            life.currentLevel++;

            if(life.currentLevel >= levels.data.length){
                alert('You Win! No More levels!');

                loop.stop();

            } else{
                alert('You Win! Loading Level ' + (life.currentLevel + 1) + ".");

                levels.load(life.currentLevel);
            }
        } else{
            resources.forEach(function(item, index, object){
                if(item.x === pos.x && item.y === pos.y){
                    if(item.type === "life"){
                        player.lives++;
                        console.log("Life Gained: You have " + player.lives + " lives.")
                    } else if(item.type === "point"){
                        player.points++;
                        life.points--;
                        console.log("Point Gained: You have " + player.points + " points. There are " + life.points + " points left.")
                    }
    
                    object.splice(index, 1);
                    document.getElementById("static-" + item.x + "-" + item.y).innerHTML = "";
                }
            });
    
            if(!settings.constantMovement){
                controls.pressedKey = null;
            }
        }
    },
};