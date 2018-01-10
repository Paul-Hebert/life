var controls = {
    bindHandlers(){
        utilities.devDebug("controls.bindHandlers");

        window.addEventListener("keydown", function(e){
            utilities.devDebug("key pressed: " + controls.keyCodes[e.keyCode]);

            e.preventDefault();

            controls.pressedKey = controls.keyCodes[e.keyCode];
        });
    },
    keyCodes: {
        "37": "left",
        "65": "left",
        "38": "up",
        "87": "up",
        "39": "right",
        "68": "right",
        "40": "down",
        "83": "down",
        "32": "space"
    },
    pressedKey: null
}