var dev = true;

document.addEventListener("DOMContentLoaded", function() {
    life.init();
});

var life = {
    dev: true,


    init: function(){
        life.devDebug('life.init');

        document.getElementById('startLoop').addEventListener('click', function() { life.loop.start(); });
        document.getElementById('stopLoop').addEventListener('click', function() { life.loop.stop(); });
    },

    loop: {
        active: false,

        start: function(){
            life.devDebug('life.loop.start');

            life.loop.active = true;

            requestAnimationFrame(life.turn);
        },

        stop: function(){
            life.devDebug('life.loop.stop');

            life.loop.active = false;
        }
    },

    turn: function(){
        life.devDebug('life.turn')
        
        if(life.loop.active){
            requestAnimationFrame(life.turn);
        }
    },

    devDebug: function(message){
        if(life.dev){
            console.log(message);
        }
    }
}