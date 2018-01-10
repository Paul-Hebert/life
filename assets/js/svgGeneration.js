var svgGeneration = {
    generate(type, width, height){
        if(type === "point" || type === "life"){
            var points = [];

            points = svgGeneration.generatePolygonPoints(width, height, 50);

            var generatedSvg = '<polygon points="' + points + '"/>'
        }

        return "<svg class='resource " + type + "' width='" + width + "' height='" + height + "'>" + generatedSvg + "</svg>";
    },

    generatePolygonPoints(width, height, pointsBase){
        var pointsHtml = "";

        var totalPoints = pointsBase * Math.random();

        var rotationChange = 360/totalPoints;
        var currentRotation = 0;

        var distance = width/20;
        var center = [width/2, height/2];
        
        for(i = 0; i < totalPoints; i++){
            currentRotation += rotationChange;

            // Convert from degrees to radians.
            var radianRotation = currentRotation * 3.141592653589793 / 180;

            var pointDistance = distance * (Math.random()/2 + 0.3);


            // Use simple trig to plot colors.
            x = center[0] + Math.sin(radianRotation) * pointDistance * center[0];
            y = center[1] + Math.cos(radianRotation) * pointDistance * center[1];

            pointsHtml += "" + x + "," + y + " ";
        }

        return pointsHtml;
    },
}