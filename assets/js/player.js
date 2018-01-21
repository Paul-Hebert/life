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
            pos.x = grid.checkBounds(levels.data[levels.current].width, pos.x - 1);
        } else if(controls.pressedKey === "right"){
            pos.x = grid.checkBounds(levels.data[levels.current].width, pos.x + 1);
        } else if(controls.pressedKey === "up"){
            pos.y = grid.checkBounds(levels.data[levels.current].height, pos.y - 1);
        }else if(controls.pressedKey === "down"){
            pos.y = grid.checkBounds(levels.data[levels.current].height, pos.y + 1);
        }

        if(player.points === levels.points){
            levels.current++;

            if(levels.current >= levels.data.length){
                alert('You Win! No More levels!');

                loop.stop();

            } else{
                alert('You Win! Loading Level ' + (levels.current + 1) + ".");

                levels.load(levels.data[levels.current]);
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
                        levels.load(levels.data[levels.current]);
                    } else{
                        alert("You lose!");
                        loop.stop();
                    }
                }

                resources.forEach(function(item, index, object){
                    if(item.x === pos.x && item.y === pos.y){
                        if(item.type === "life"){
                            player.gainLife();
                        } else if(item.type === "point"){
                            player.points++;
                            player.renderData.points();                                    
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