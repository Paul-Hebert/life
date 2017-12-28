var dev = true;

document.addEventListener("DOMContentLoaded", function() {
    life.init();
});

var life = {
    dev: true,
    gridData: [],
    gridHtml: "",
    startingPopulation: .8,
    width:30,
    height:30,

    init: function(){
        life.devDebug('life.init');

        life.buildGridData();
        life.buildGridSkeleton();
        life.renderGrid();

        document.getElementById('startLoop').addEventListener('click', function() { life.loop.start(); });
        document.getElementById('stopLoop').addEventListener('click', function() { life.loop.stop(); });
    },

    buildGridData(orgs){
        life.devDebug('life.buildGridData');

        for(var i = 0; i < life.height; i++){
            var row = [];

            for(var x = 0; x < life.width; x++){
                row.push(life.buildDot());
            }

            life.gridData.push(row);
        }

        life.devDebug(life.gridData, true);
    },

    buildGridSkeleton(){
        life.devDebug('life.buildGridSkeleton');

        life.gridHtml = "";

        for(var i = 0; i < life.height; i++){
            var row = "<div class='row'>";

            for(var x = 0; x < life.width; x++){
                var liveClass = life.gridData[i][x] ? "alive" : "";

                row += "<span class='dot " + liveClass + "'></span>";
            }

            row += "</div>";

            life.gridHtml += row;
        }

        life.devDebug(life.gridHtml);
    },

    buildDot(){
        life.devDebug('life.buildDot');

        return Math.random() > life.startingPopulation;
    },

    renderGrid(){
        life.devDebug('life.renderGrid');

        document.getElementById('grid').innerHTML = life.gridHtml;
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

        life.renderGrid();

        if(life.loop.active){
            requestAnimationFrame(life.turn);
        }
    },

    devDebug: function(message, table){
        if(life.dev){
            if(table){
                console.table(message);
            } else{
                console.log(message);                
            }
        }
    }
}