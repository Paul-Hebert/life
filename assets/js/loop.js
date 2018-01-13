var loop = {
    active: false,

    now: null,
    dt: null,
    last: null,

    start(){
        utilities.devDebug('loop.start');

        loop.active = true;

        loop.now = null;
        loop.duration = null;
        loop.last = loop.timestamp();

        requestAnimationFrame(loop.turn);
    },

    stop(){
        utilities.devDebug('loop.stop');

        loop.active = false;
    },

    toggle(){
        utilities.devDebug('loop.toggle');

        if(loop.active){
            loop.stop();
        } else{
            loop.start();
        }
    },

    turn(){
        utilities.devDebug('loop.turn');
        if(controls.pressedKey === "space"){
            console.log('toggle')
            loop.toggle();

            controls.pressedKey = null;
        }

        loop.now = loop.timestamp();
        loop.duration = loop.now - loop.last;

        if(loop.active){
            if(loop.duration >= settings.rate){
                life.takeTurn();
            }
        }

        requestAnimationFrame(loop.turn);
    },

    timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }
};