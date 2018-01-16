var utilities = {
    devDebug(message, table){
        if(settings.dev){
            if(table){
                console.table(message);
            } else{
                console.log(message);                
            }
        }
    },
    rotateArray(array, rotation){
        var newArray = array;

        rotation = parseInt(rotation)

        if(rotation === 0 || rotation === 360){
            return array;
        }

        if(rotation === 90){
            newArray = utilities.flipArray(newArray, 'vertical');
            newArray = utilities.transpose(newArray);
        } else if(rotation === 180){
            newArray = utilities.flipArray(newArray, 'horizontal');
            newArray = utilities.flipArray(newArray, 'vertical');
        } else if(rotation === 270){
            newArray = utilities.flipArray(newArray, 'horizontal');
            newArray = utilities.transpose(newArray);
        } else{
            console.log("You can only rotate by 90, 180, or 270 degrees");
            return false;
        }

        return newArray;
    },
    // Rotates an array
    transpose(array){
        var height = array.length - 1;

        var width = array[0].length - 1;

        var newArray = [];

        for(x = 0; x <= width; x++){
            var newRow = [];

            for(y = 0; y <= height; y++){
                newRow.push(array[y][x]);
            }

            newArray.push(newRow);
        }

        return newArray;
    },
    // Flips an array
    flipArray(array, direction){
        if(direction === "none"){
            return array;
        }

        var height = array.length - 1;

        var width = array[0].length - 1;

        var newArray = [];
        
        for(y = 0; y <= height; y++){
            var newRow = [];

            for(x = 0; x <= width; x++){
                if(direction === 'horizontal'){
                    newRow.push(array[y][width - x]); 
                } else if(direction === 'vertical'){
                    newRow.push(array[height - y][x]);
                } else{
                    console.log("You can only flip by vertical or horizontal")
                    return false;
                }
            }

            newArray.push(newRow);
        }

        return newArray;
    }
}