
// Sierpinski Triangle
// Elena Wheatley
// 1/18/22

// using _ for global variables
var center_x = 200;
var center_y = 250;
var first_radius = 150;
var radius_divisor = 2;
var completed_iterations = 0;
var total_iterations = 1;
var point_array;
var point_string;

var documentation = document.createElement('p');
document.body.appendChild(documentation);


var increase_iterations = document.getElementById("increaseIterations");
var decrease_iterations = document.getElementById("decreaseIterations");
var iteration_count = document.getElementById("iterationCount");


var fractal_var = document.getElementById("fractal");


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

// calculates the centers of the smaller triangles
function calculateNewCenters(centerX1, centerY1, radius1) {
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
    var newCenters = calculateNewCenters(xCenter, yCenter, firstRadius);
    
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


// maximum iterations: 10
function increaseFractalIterations() {
    if (total_iterations <= 9) {

        total_iterations++;
        
        point_array = createSierpinskiTriangle(point_array, center_x, center_y, 
        first_radius, radius_divisor, completed_iterations, total_iterations);
        completed_iterations++;

        point_string = convertPointArrayToString(point_array[total_iterations - 1]);
        fractal_var.setAttribute("points", point_string);
        //documentation.innerHTML = point_string;
        
        iteration_count.innerHTML = total_iterations;
        completed_iterations = point_array.length;
    }
}

// minimum iterations: 1
function decreaseFractalIterations() {
    if (total_iterations >= 2) {
        
        total_iterations--;
        
        point_string = convertPointArrayToString(point_array[total_iterations - 1]);
        fractal_var.setAttribute("points", point_string);
        //documentation.innerHTML = point_string;
        
        iteration_count.innerHTML = total_iterations;
    }
}


increase_iterations.addEventListener("click", increaseFractalIterations);
decrease_iterations.addEventListener("click", decreaseFractalIterations);


drawSierpinskiTriangle(fractal_var, point_array, center_x, center_y, first_radius, 
radius_divisor, completed_iterations, total_iterations);
iteration_count.innerHTML = total_iterations;
//completed_iterations = point_array.length;

