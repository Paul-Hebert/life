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
    transpose(array) {
        return array.reduce((prev, next) => next.map((item, i) =>
            (prev[i] || []).concat(next[i])
        ), []);
    },

    // Rotates an array
    /*rotateArray(array, rotation){
        rotation = parseInt(rotation)

        if(rotation === 0 || rotation === 360){
            return array;
        }

        var length = array.length;

        var height = array[0].length;

        var newArray = [];

        console.table(array)

        if(rotation === 90){
            var firstStart = 0;
            var firstEnd = height;
            var firstChange = 1;

            var secondStart = length;
            var secondEnd = 0;
            var secondChange = -1;
        } else if(rotation === 180){
            var firstStart = height;
            var firstEnd = 0;
            var firstChange = -1;

            var secondStart = 0;
            var secondEnd = length;
            var secondChange = 1;
        } else if(rotation === 270){
            var firstStart = height;
            var firstEnd = 0;
            var firstChange = -1;

            var secondStart = length;
            var secondEnd = 0;
            var secondChange = -1;
        } else{
            console.log("You can only rotate by 90, 180, or 270 degrees")
            return false;
        }

        for(first = firstStart; first !== firstEnd; first += firstChange){
            var newRow = [];

            for(second = secondStart; second !== secondEnd; second += secondChange){
                var tempFirst = first + (firstChange === -1 ? -1 : 0);
                var tempSecond = second + (secondChange === -1 ? -1 : 0);

                console.log("first: " + tempFirst);
                console.log("second: " + tempSecond);

                console.log("data: " + array[tempFirst][tempSecond])

                newRow.push(array[tempFirst][tempSecond]);
            }

            newArray.push(newRow);
        }

        console.table(newArray)

        return newArray;
    },*/
    // Flips an array
    flipArray(array, direction){
        if(direction === "none"){
            return array;
        }

        var length = array.length;

        var height = array[0].length;

        var newArray = [];

        if(direction === 'horizontal'){
            var firstStart = 0;
            var firstEnd = height;
            var firstChange = 1;

            var secondStart = length;
            var secondEnd = 0;
            var secondChange = -1;
        } else if(direction === 'vertical'){
            var firstStart = height;
            var firstEnd = 0;
            var firstChange = -1;

            var secondStart = 0;
            var secondEnd = length;
            var secondChange = 1;
        } else{
            console.log("You can only flip by vertical or horizontal")
            return false;
        }

        for(first = firstStart; first !== firstEnd; first += firstChange){
            var newRow = [];

            for(second = secondStart; second !== secondEnd; second += secondChange){
                var tempFirst = first + (firstChange === -1 ? -1 : 0);
                var tempSecond = second + (secondChange === -1 ? -1 : 0);

                newRow.push(array[tempFirst][tempSecond]);
            }

            newArray.push(newRow);
        }

        return newArray;
    }
}