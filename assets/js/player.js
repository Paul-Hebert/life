var player = {
    lives: 3,
    points: 0,
    speed:0,
    maxSpeed: 30,
    direction: "none",
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
    checkControls(){
        utilities.devDebug("player.checkControls");

        var newDirection = null;

        if(controls.pressedKey === "left"){
            newDirection = "left";
        } else if(controls.pressedKey === "right"){
            newDirection = "right";
        } else if(controls.pressedKey === "up"){
            newDirection = "up";
        }else if(controls.pressedKey === "down"){
            newDirection = "down";
        }
        if(newDirection === null){
            player.speed -= 10;
        } else if(newDirection === player.direction){
            player.speed += 3;
        } else{
            player.speed = 1;
        }

        if(player.speed > player.maxSpeed){
            player.speed = player.maxSpeed;
        } else if(player.speed < 0){
            player.speed = 0;
        }

        player.direction = newDirection;

        controls.pressedKey = null;
    },
    move(){
        utilities.devDebug("player.move");

        var pos = Object.assign(player.position, {});
        var oldX = pos.x;
        var oldY = pos.y;

        if(player.direction === "left"){
            pos.x = grid.checkBounds(levels.current.width, pos.x - 1);
        } else if(player.direction === "right"){
            pos.x = grid.checkBounds(levels.current.width, pos.x + 1);
        } else if(player.direction === "up"){
            pos.y = grid.checkBounds(levels.current.height, pos.y - 1);
        }else if(player.direction === "down"){
            pos.y = grid.checkBounds(levels.current.height, pos.y + 1);
        }

        if(typeof player.position !== "undefined"){
            document.getElementById("dynamic-" + player.position.x + "-" + player.position.y).classList.add('player');
        }

        if(player.points === levels.points){
            levels.currentIndex++;

            if(levels.currentIndex >= levels.data.length){
                alert('You Win! No More levels!');

                loop.stop();

            } else{
                alert('You Win! Loading Level ' + (levels.currentIndex + 1) + ".");

                levels.load(levels.data[levels.currentIndex]);
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
                        levels.load(levels.current);
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