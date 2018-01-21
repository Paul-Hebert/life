var menus = {
    startMenu: {
        build(){
            var menuHtml = "";
            menus.addButton(ui.startMenu, "Start", "", "startGameButton", true, function(){
                life.startGame();
            });

            for(let levelCount = 0; levelCount < levels.data.length; levelCount++){
                menus.addButton(ui.startMenu, levels.data[levelCount].name, "", "", true, function(){
                    levels.currentIndex = levelCount;
                    
                    levels.load(levels.data[levelCount]);
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

            menus.addButton(ui.levelBuilderMenu, "Add Player", "", "addPlayerButton", false, function(){
                levels.builder.currentAction = levels.builder.addPlayer.bind({});
            });

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

            var rotationOptions = [
                {
                    value: 0,
                    text: "0 degrees"
                },
                {
                    value: 90,
                    text: "90 degrees"
                },
                {
                    value: 180,
                    text: "180 degrees"
                },
                {
                    value: 270,
                    text: "270 degrees"
                }
            ];

            menus.addDropdown(ui.levelBuilderMenu, rotationOptions, "", "rotationOptions", function(value){
                levels.builder.currentRotation = value;
            });

            var flipOptions = [
                {
                    value: "none",
                    text: "none"
                },
                {
                    value: "horizontal",
                    text: "horizontal"
                },
                {
                    value: "vertical",
                    text: "vertical"
                }
            ];

            menus.addDropdown(ui.levelBuilderMenu, flipOptions, "", "flipOptions", function(value){
                levels.builder.currentFlipDirection = value;
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