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
    startLoopButton: document.getElementById('startLoop'),
    stopLoopButton: document.getElementById('stopLoop'),

    rateInput: document.getElementById('rate'),

    primaryGrid: document.getElementById('primaryGrid'),

    body: document.body
};

var controls = {
    bindHandlers(){
        utilities.devDebug("controls.bindHandlers");

        window.addEventListener("keydown", function(e){
            utilities.devDebug("key pressed: " + controls.keyCodes[e.keyCode]);

            e.preventDefault();

            controls.pressedKey = controls.keyCodes[e.keyCode];
        });
    },
    keyCodes: {
        "37": "left",
        "38": "up",
        "39": "right",
        "40": "down"
    },
    pressedKey: null
}

var life = {
    currentLevel: 0,

    init(){
        utilities.devDebug('life.init');

        life.setGridSettingsUi();

        ui.startLoopButton.addEventListener('click', function() { loop.start(); });
        ui.stopLoopButton.addEventListener('click', function() { loop.stop(); });

        controls.bindHandlers();
    },

    startGame(){
        utilities.devDebug('life.startGame');

        life.currentLevel = 0;

        levels.load(life.currentLevel);
    },

    setGridSettingsUi(){
        utilities.devDebug('life.getGridSettings');

        ui.rateInput.value = settings.rate;

        settings.gridTheme.forEach(function(theme){
            ui.body.classList.add(theme);
        });
    },

    getGridSettings(){
        utilities.devDebug('life.getGridSettings');

        settings.rate = ui.rateInput.value;
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

        if(document.getElementById(pos.x + '-' + pos.y).classList.contains('alive')){
            document.getElementById(pos.x + '-' + pos.y).classList.add('engorged');

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

            alert('You Win! Loading Level ' + (life.currentLevel + 1) + ".");

            levels.load(life.currentLevel);
        } else{
            resources.forEach(function(item, index, object){
                if(item.x === pos.x && item.y === pos.y){
                    if(item.type === "life"){
                        player.lives++;
                        console.log("Life Gained: You have " + player.lives + " lives.")
                    } else if(item.type === "point"){
                        player.points++;
                        life.points--;
                        console.log("Point Gained: You have " + player.points + " points.")
                    }
    
                    object.splice(index, 1);
                    document.getElementById(item.x + "-" + item.y).classList.remove('resource', item.type);
                }
            });
    
            if(!settings.constantMovement){
                controls.pressedKey = null;
            }
        }
    },
};