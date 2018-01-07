var loop = {
    active: false,

    now: null,
    dt: null,
    last: null,

    start(){
        utilities.devDebug('loop.start');

        ui.stopLoopButton.style.display = "inline";
        ui.startLoopButton.style.display = "none";

        loop.active = true;

        loop.now = null;
        loop.duration = null;
        loop.last = loop.timestamp();

        requestAnimationFrame(loop.turn);
    },

    stop(){
        utilities.devDebug('loop.stop');

        ui.stopLoopButton.style.display = "none";
        ui.startLoopButton.style.display = "inline";

        loop.active = false;
    },

    turn(){
        loop.now = loop.timestamp();
        loop.duration = loop.now - loop.last;

        if(loop.duration >= settings.rate){
            life.takeTurn();
        }

        if(loop.active){
            requestAnimationFrame(loop.turn);
        }
    },

    timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }
};