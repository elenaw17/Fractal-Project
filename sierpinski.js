
//Sierpinski 2 (incomplete without php)
//Elena Wheatley
//3/24/22

var fractalType = "triangle";

// using _ for global variables
var center_x = 200;
var center_y;
var first_radius;
var radius_divisor;
var completed_iterations = 0;
var total_iterations = 8;
var point_array;
var point_string;

/* 
converts an array of points to a string of points that can be used
for a polygon element
*/
function convertPointArrayToString(pointArray1) {
    var i = 0;
    var pointString = `${pointArray1[i][0]},${pointArray1[i][1]}`;
    for (i = 1; i < pointArray1.length; i++) {
        pointString += ` ${pointArray1[i][0]},${pointArray1[i][1]}`;
    }
    return pointString;
}

/* 
creates a string of points representing an equilateral triangle
starting angle: -PI / 6
the first point will be at both the beginning and end of the string
calculate centers of smaller triangles: createTrianglePointArray(centerX, centerY, radius / 2)
*/
function createTrianglePointArray(centerX1, centerY1, radius1) {
    var angle = Math.PI / -6;
    var xCoord;
    var yCoord;
    var pointArray = []; // important to set to [] first?
    
    for (var i = 0; i < 3; i++) {
        xCoord = centerX1 + (radius1 * Math.cos(angle));
        yCoord = centerY1 - (radius1 * Math.sin(angle));
        // y coord subtracts radius to account for reversed y coordinates
        pointArray.push([xCoord, yCoord]);
        angle = angle + 2/3 * Math.PI;
    }
    pointArray.push(pointArray[0]);
    
    return pointArray;
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

// calculates the centers of the smaller triangles
function calculateNewCenters1(centerX1, centerY1, radius1) {
    var angle = Math.PI / -6;
    var xCoord;
    var yCoord;
    var pointArray = []; // important
    
    for (var i = 0; i < 3; i++) {
        xCoord = centerX1 + (Math.cos(angle) * radius1 / 2);
        yCoord = centerY1 - (Math.sin(angle) * radius1 / 2);
        // y coord subtracts radius to account for reversed y coordinates
        pointArray.push([xCoord, yCoord]);
        angle = angle + 2/3 * Math.PI;
    }
    return pointArray;
}

function calculateNewCenters2(centerX, centerY, radius) {
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

// scales and translates the point array
function transformPointArray(pointArray, firstCenterX, firstCenterY, 
newCenterX, newCenterY, divisor) {
    var transformedArray = [];
    var xCoord;
    var yCoord;
    var i;
    
    for (i = 0; i < pointArray.length; i++) {
        // step 1: move center to (0, 0)
        xCoord = pointArray[i][0] - firstCenterX;
        yCoord = pointArray[i][1] - firstCenterY;

        // step 2: scale array (divide values by divisor)
        xCoord /= divisor;
        yCoord /= divisor;
        
        // step 3: move center of array to ideal point, shift entire array
        xCoord += newCenterX;
        yCoord += newCenterY;
        transformedArray.push([xCoord, yCoord]);
    }

    return transformedArray;
}

// creates a Sierpinski triangle array
function createSierpinskiTriangle(pointArray, xCenter, yCenter, firstRadius, 
radiusDivisor, completedIterations, totalIterations) {
    
    var singleIterationArray;
    var transformedArray;
    var newCenters = calculateNewCenters1(xCenter, yCenter, firstRadius);
    
    if (completedIterations === 0) {
        pointArray = [];
        singleIterationArray = createTrianglePointArray(xCenter, yCenter, firstRadius);
        pointArray.push(singleIterationArray);
        completedIterations++;
    }
    
    var i;
    var j;
    while (completedIterations < totalIterations) {
        singleIterationArray = [];
        
        for (i = 0; i < 3; i++) {
            // adding the translated and scaled versions to singleIterationArray
            transformedArray = transformPointArray(pointArray[completedIterations - 1], xCenter, 
            yCenter, newCenters[i][0], newCenters[i][1], radiusDivisor);
            
            for (j = 0; j < transformedArray.length; j++) {
                singleIterationArray.push(transformedArray[j]);
            }
            
            // making sure each new triangle is closed off
            singleIterationArray.push(singleIterationArray[0]);
        }
        pointArray.push(singleIterationArray);
        completedIterations++;
    }
    return pointArray;
}

function createSierpinskiCarpet(pointArray, xCenter, yCenter, firstRadius, 
radiusDivisor, completedIterations, totalIterations) {
    
    var singleIterationArray;
    var transformedArray;
    var newCenters = calculateNewCenters2(xCenter, yCenter, firstRadius);
    
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

function drawSierpinskiTriangle(fractalVar, pointArray, centerX, centerY, 
firstRadius, radiusDivisor, completedIterations, totalIterations) {
    
    if (totalIterations > completedIterations) {
        pointArray = createSierpinskiTriangle(pointArray, centerX, centerY, 
        firstRadius, radiusDivisor, completedIterations, totalIterations);
    }
    
    pointString = convertPointArrayToString(pointArray[totalIterations - 1]);
    
    fractalVar.setAttribute("points", pointString);
    
    //documentation.innerHTML = pointString;
}


var documentation = document.createElement('p');
document.body.appendChild(documentation);

var increase_iterations = document.getElementById("increaseIterations");
var decrease_iterations = document.getElementById("decreaseIterations");
var iteration_count = document.getElementById("iterationCount");

var fractal_var = document.getElementById("fractal");


if (fractalType === "triangle")
{
/*****************************************************************************************************
// Sierpinski Triangle
// Elena Wheatley
// 1/18/22
*****************************************************************************************************/
center_y = 250;
radius_divisor = 2;
first_radius = 150;

drawSierpinskiTriangle(fractal_var, point_array, center_x, center_y, first_radius, 
radius_divisor, completed_iterations, total_iterations);
iteration_count.innerHTML = total_iterations;
//completed_iterations = point_array.length;
}
else if(fractalType === "carpet") {
    
/****************************************************************************************************
// Sierpinski Carpet
// Elena Wheatley
// 1/21/22
****************************************************************************************************/

center_y = 200;
radius_divisor = 3;
first_radius = 200;

point_array = createSierpinskiCarpet(point_array, center_x, center_y, 
first_radius, radius_divisor, completed_iterations, total_iterations);

point_string = convertPointArrayToString(point_array[total_iterations - 1]);
//documentation.innerHTML = point_string;

fractal_var.setAttribute("points", point_string); 
}
