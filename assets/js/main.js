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

        life.currentLevel = 0;

        levels.load(levels.data[life.currentLevel]);
    },

    takeTurn(){
        utilities.devDebug('life.takeTurn');

        loop.last = loop.now;
        
        grid.updateData();

        if(typeof player.position !== "undefined"){
            player.move();
        }

        grid.render();
    },
};