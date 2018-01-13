var menus = {
    startMenu: {
        build(){
            var menuHtml = "";
            menus.addButton(ui.startMenu, "Start", "", "startGameButton", true, function(){
                life.startGame();
            });

            for(let levelCount = 0; levelCount < levels.data.length; levelCount++){
                menus.addButton(ui.startMenu, levels.data[levelCount].name, "", "", true, function(){
                    life.currentLevel = levelCount;
                    
                    levels.load(levelCount);
                });
            }

            menus.addButton(ui.startMenu, "Level Builder", "", "levelBuilderButton", true, function(){
                levels.builder.open(30,30);
            });
        }
    },

    levelBuilderMenu: {
        build(){
            var menuHtml = "";

            menus.addButton(ui.levelBuilderMenu, "Toggle Dot", "", "toggleDotButton", false, function(){
                levels.builder.currentAction = levels.builder.toggleCell.bind({});
            });

            menus.addButton(ui.levelBuilderMenu, "Toggle Point", "", "togglePoint", false, function(){
                levels.builder.currentAction = levels.builder.togglePoint.bind({});
            });

            menus.addButton(ui.levelBuilderMenu, "Toggle Life", "", "toggleLife", false, function(){
                levels.builder.currentAction = levels.builder.toggleLife.bind({});
            });
        }
    },

    addButton(parent, text, classes, id,  closeParent, callback){
        var button = "<button class='" + classes + "' id='" + classes + "'>" + text + "</button>";

        var button = document.createElement('button');
        button.classList = classes;
        button.id = id;
        button.innerHTML = text;
        button.addEventListener('click', function(){
            callback();

            if(closeParent){
                parent.style.display = "none";
            }
        });

        parent.appendChild(button);
    },
};