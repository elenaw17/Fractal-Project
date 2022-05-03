
// Sierpinski Carpet
// Elena Wheatley
// 1/21/22

var center_x = 200;
var center_y = 200;
var first_radius = 200;
var radius_divisor = 3;
var completed_iterations = 0;
var total_iterations = 6;
var point_array;
var point_string;

var fractal_var = document.getElementById("fractal");

var documentation = document.createElement('p');
document.body.appendChild(documentation);


/* 
converts an array of points to a string of points that can be used
for a polygon element
*/
function convertPointArrayToString(pointArray) {
    var i = 0;
    var pointString = `${pointArray[i][0]},${pointArray[i][1]}`;
    for (i = 1; i < pointArray.length; i++) {
        pointString += ` ${pointArray[i][0]},${pointArray[i][1]}`;
    }
    return pointString;
}

/*
creates a string of points representing a square
starting angle: -PI / 4
the first point is added to the end of the string
*/
function createSquarePointArray(centerX, centerY, radius) {
    var angle = Math.PI / -4;
    var xCoord;
    var yCoord;
    var pointArray = [];
    
    for (let i = 0; i < 4; i++) {
        xCoord = centerX + (radius * Math.cos(angle));
        yCoord = centerY - (radius * Math.sin(angle));
        // y coord subtracts radius to account for reversed y coordinates
        pointArray.push([xCoord, yCoord]);
        angle = angle + Math.PI / 2;
    }
    pointArray.push(pointArray[0]);
    
    return pointArray;
}

function calculateNewCenters(centerX, centerY, radius) {
    var angle = Math.PI / -4;
    var newRadius = (2/3) * radius;
    var xCoord;
    var yCoord;
    var pointArray = [];
    var i;
    
    
    for (i = 0; i < 4; i++) {
        xCoord = centerX + (newRadius * Math.cos(angle));
        yCoord = centerY - (newRadius * Math.sin(angle));
        // y coord subtracts radius to account for reversed y coordinates
        pointArray.push([xCoord, yCoord]);
        angle = angle + Math.PI / 2;
    }
    
    angle = 0;
    newRadius = (Math.sqrt(2) / 3) * radius;
    
    for (i = 0; i < 4; i++) {
        xCoord = centerX + (newRadius * Math.cos(angle));
        yCoord = centerY - (newRadius * Math.sin(angle));
        // y coord subtracts radius to account for reversed y coordinates
        pointArray.push([xCoord, yCoord]);
        angle = angle + Math.PI / 2;
    }
    
    return pointArray;
}

function transformPointArray(pointArray, firstCenterX, firstCenterY, 
newCenterX, newCenterY, radiusDivisor) {
    var transformedArray = [];
    var xCoord;
    var yCoord;
    var i;
    
    for (i = 0; i < pointArray.length; i++) {
        // step 1: move center to (0, 0)
        xCoord = pointArray[i][0] - firstCenterX;
        yCoord = pointArray[i][1] - firstCenterY;

        // step 2: scale array (divide values by divisor)
        xCoord /= radiusDivisor;
        yCoord /= radiusDivisor;
        
        // step 3: move center of array to ideal point, shift entire array
        xCoord += newCenterX;
        yCoord += newCenterY;
        transformedArray.push([xCoord, yCoord]);
    }

    return transformedArray;
}

function createSierpinskiCarpet(pointArray, xCenter, yCenter, firstRadius, 
radiusDivisor, completedIterations, totalIterations) {
    
    var singleIterationArray;
    var transformedArray;
    var newCenters = calculateNewCenters(xCenter, yCenter, firstRadius);
    
    if (completedIterations === 0) {
        pointArray = [];
        singleIterationArray = createSquarePointArray(xCenter, yCenter, firstRadius);
        pointArray.push(singleIterationArray);
        completedIterations++;
    }
    
    var i;
    var j;
    while (completedIterations < totalIterations) {
        singleIterationArray = [];
        
        for (i = 0; i < newCenters.length; i++) {
            // adding the translated and scaled versions to singleIterationArray
            transformedArray = transformPointArray(pointArray[completedIterations - 1], xCenter, 
            yCenter, newCenters[i][0], newCenters[i][1], radiusDivisor);
            for (j = 0; j < transformedArray.length; j++) {
                singleIterationArray.push(transformedArray[j]);
            }
            // making sure each new square is closed off
            singleIterationArray.push(singleIterationArray[0]);
        }
        pointArray.push(singleIterationArray);
        completedIterations++;
    }
    return pointArray;
}


point_array = createSierpinskiCarpet(point_array, center_x, center_y, 
first_radius, radius_divisor, completed_iterations, total_iterations);

point_string = convertPointArrayToString(point_array[total_iterations - 1]);
//documentation.innerHTML = point_string;

fractal_var.setAttribute("points", point_string); 
