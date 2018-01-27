document.addEventListener("DOMContentLoaded", function() {
    life.init();
});

var resources = [];
var obstacles = [];

var life = {
    currentLevel: 0,

    init(){
        utilities.devDebug('life.init');

        menus.startMenu.build();

        controls.bindHandlers();

        settings.gridTheme.forEach(function(theme){
            ui.body.classList.add(theme);
        });
    },

    startGame(){
        utilities.devDebug('life.startGame');

        levels.currentIndex = 0;
                    
        levels.load(levels.data[0]);
    },

    takeTurn(){
        utilities.devDebug('life.takeTurn');

        loop.last = loop.now;
        
        grid.updateData();

        if(typeof player.position !== "undefined"){
            player.checkControls();
            for(var i = 0; i <= player.speed; i += 10){
                player.move();
            }
        }

        grid.render();
    },
};