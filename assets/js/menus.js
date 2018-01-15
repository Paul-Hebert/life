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

            menus.addButton(ui.levelBuilderMenu, "Add Cell", "", "addCellButton", false, function(){
                levels.builder.currentAction = levels.builder.addCell.bind({});
            });

            menus.addButton(ui.levelBuilderMenu, "Add Point", "", "addPoint", false, function(){
                levels.builder.currentAction = levels.builder.addPoint.bind({});
            });

            menus.addButton(ui.levelBuilderMenu, "Add Life", "", "addLife", false, function(){
                levels.builder.currentAction = levels.builder.addLife.bind({});
            });

            menus.addButton(ui.levelBuilderMenu, "Add Rock", "", "addRock", false, function(){
                levels.builder.currentAction = levels.builder.addRock.bind({});
            });

            menus.addButton(ui.levelBuilderMenu, "Add Creature", "", "addCreature", false, function(){
                levels.builder.currentAction = levels.builder.addCreature.bind({});
            });

            var creatureKeys = Object.keys(creatures);

            var creatureOptions = [];

            creatureKeys.forEach(creatureKey => {
                creatureOptions.push({
                    value: creatureKey,
                    text: creatures[creatureKey].name
                });
            });

            menus.addDropdown(ui.levelBuilderMenu, creatureOptions, "", "creatureOptions", function(value){
                levels.builder.currentCreature = value;
            });
        }
    },

    addButton(parent, text, classes, id,  closeParent, callback){
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

    addDropdown(parent, options, classes, id, callback){
        var select = document.createElement('select');

        select.classList = classes;
        select.id = id;
        select.addEventListener('change', function(){
            callback(this.value);
        });

        options.forEach(option => {
            var optionNode = document.createElement('option');

            optionNode.value = option.value;
            optionNode.innerHTML = option.text;

            select.appendChild(optionNode);
        });

        parent.appendChild(select);
    },
};