var svg = {
    generate(type, width, height){
        var template = svg.data[type];
        
        width *= template.size;
        height *= template.size;

        var points = [];

        points = svg.generatePolygonPoints(width, height, template.points, template.distance);

        var generatedSvg = '<polygon points="' + points + '"/>'

        return "<svg class='" + template.classes + "' width='" + width + "' height='" + height + "'>" + generatedSvg + "</svg>";
    },

    generatePolygonPoints(width, height, pointsBase, distanceSettings){
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

            var pointDistance = distance * (Math.random()/distanceSettings.variance + distanceSettings.base);


            // Use simple trig to plot colors.
            x = center[0] + Math.sin(radianRotation) * pointDistance * center[0];
            y = center[1] + Math.cos(radianRotation) * pointDistance * center[1];

            pointsHtml += "" + x + "," + y + " ";
        }

        return pointsHtml;
    },

    data: {
        life: {
            classes: "resource life",
            size:1,
            points:50,
            distance: {
                base: .1,
                variance:1.5
            }
        },
        point: {
            classes: "resource point",
            size:1,
            points:25,
            distance: {
                base: 0.3,
                variance: 1.5
            }
        },
        rock: {
            classes: "obstacle rock",
            size:1,
            points:50,
            distance: {
                base: 0.7,
                variance: 3
            }
        }
    }
}