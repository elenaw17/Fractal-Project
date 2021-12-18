// index.js
// Elena Wheatley
// 11/30/21

/* Procedure:
creates a seed (set of connected line segments)
starts with a specified shape
for each iteration replaces each straight line in the shape with the seed
*/

/* 
This contains the points of the seed line in a format
that can be used in the drawLinesFromPoints function.
*/
var seed = [[0, 0], [100, 100], [200, 0], [300, 100]];

var originalFigure = [[0, 200], [400, 200]];


/*
The function takes in a context variable for the canvas that it draws on.
The function takes in a matrix containing each point of each line segment.
Each index of the matrix should have a nested index representing a point.
Each nested index has an x value (index 0) and a y value (index 1).
The first line segment is drawn from the 1st to 2nd point, the next one from 2nd to 3rd etc.
The line segments end at the last point and don't loop back to the first.
*/
function drawLinesFromPoints(contextVar, lineMatrix) {
    let i;

    contextVar.beginPath();
    contextVar.moveTo(lineMatrix[0][0], lineMatrix[0][1]);
    
    for (i = 1; i < lineMatrix.length; i++) {
        contextVar.lineTo(lineMatrix[i][0], lineMatrix[i][1]);
    }
    
    contextVar.strokeStyle = "black";
    contextVar.stroke();
}

/* 
takes in a matrix representing a figure (same syntax as in drawLinesFromPoints)
centers the first point of the figure at (0, 0), and adjusts other points
calculates the figure rotated given angle (standard position, clockwise*)
*The rotation is clockwise because the canvas coordinates are like that of the 
first quadrant of a graph but upside down.
returns the new points of the figure in matrix form (doesn't print the figure)
*/
function rotateFigure(lineMatrix, angle) {
    
    var newMatrix = [];

    var firstX = lineMatrix[0][0];
    var firstY = lineMatrix[0][1];
    
    var xValue;
    var yValue;
    
    var i;
    
    // translating figure to put first point at (0, 0)
    // rotating figure by the angle
    for (i = 0; i < lineMatrix.length; i++) {
            
        newMatrix.push([]);
            
        xValue = lineMatrix[i][0];
        yValue = lineMatrix[i][1];
            
        xValue -= firstX;
        yValue -= firstY;
        
        // calculating the rotation (formula calculated using complex numbers)
        xValue = (xValue * Math.cos(angle)) - (yValue * Math.sin(angle));
        yValue = (xValue * Math.sin(angle)) + (yValue * Math.cos(angle));
            
        newMatrix[i].push(xValue);
        newMatrix[i].push(yValue);
    }
    
    return newMatrix;
}

/*
takes in a matrix representing a figure (same syntax as in drawLinesFromPoints)
scaleFactor = target distance / original distance
centers the first point of the figure at (0, 0), and adjusts other points
calculates each point multiplied by the scale factor
returns the new points of the figure in matrix form (doesn't print the figure)
*/
function scaleFigure(lineMatrix, scaleFactor) {
    
    var newMatrix = [];
    
    var firstX = lineMatrix[0][0];
    var firstY = lineMatrix[0][1];
    
    var xValue;
    var yValue;
    
    var i;
    
    // translating figure to put first point at (0, 0)
    // scaling the figure
    for (i = 0; i < lineMatrix.length; i++) {
            
        newMatrix.push([]);
            
        xValue = lineMatrix[i][0];
        yValue = lineMatrix[i][1];
            
        xValue -= firstX;
        yValue -= firstY;
        
        xValue *= scaleFactor;
        yValue *= scaleFactor;
        
        newMatrix[i].push(xValue);
        newMatrix[i].push(yValue);
    }
    
    return newMatrix;
}

/*
takes in a matrix representing a figure (same syntax as in drawLinesFromPoints)
takes in a matrix representing the target point to move the first point to
moves the first point to the target point, and adjusts the remaining points
returns the new points of the figure in matrix form (doesn't print the figure)
*/
function translateFigure(lineMatrix, targetPoint) {
    
    var newMatrix = [];
    
    // original point + (target point - original point) = target point
    var xShift = targetPoint[0] - lineMatrix[0][0];
    var yShift = targetPoint[1] - lineMatrix[0][1];
    
    var xValue;
    var yValue;
    
    var i;
    
    for (i = 0; i < lineMatrix.length; i++) {
        
        newMatrix.push([]);
            
        xValue = lineMatrix[i][0];
        yValue = lineMatrix[i][1];
        
        xValue += xShift;
        yValue += yShift;
        
        newMatrix[i].push(xValue);
        newMatrix[i].push(yValue);
    }
    
    return newMatrix;
}

/* 
Finds and returns the angle between two points
takes in two matrices, each with an x and y value 
point1 is startPoint, point2 is endPoint
Sets the end point to what it would be if the start point was at (0, 0)
tan(angle) = y value of endpoint / x value of endpoint
arctan(tan(angle)) = angle
*/
function findAngle(point1, point2) {
    var endX = point2[0] - point1[0];
    var endY = point2[1] - point1[1];
    var angle;
    if (endX === 0) {
        angle = Math.atan(endY / endX);
    }
    else if (endY > 0) {
        angle = Math.PI / 2;
    }
    else if (endY < 0) {
        angle = Math.PI * 3 / 2;
    }
    else {
        // default value if angle cannot be found
        angle = 0;
    }
    return angle; 
}

/* 
Finds and returns the distance between two points
takes in two matrices, each with an x and y value
point1 is startPoint, point2 is endPoint
Sets the end point to what it would be if the start point was at (0, 0)
distance = sqrt((xdistance)²+(ydistance)²), applying the distance formula
*/
function findDistance(point1, point2) {
    var endX = point2[0] - point1[0];
    var endY = point2[1] - point1[0];
    var distance = Math.sqrt((endX * endx) + (endY * endY));
    return distance;
}


var fractalContext = document.getElementById("fractal").getContext("2d");

/*
drawLinesFromPoints(fractalContext, seed);

drawLinesFromPoints(fractalContext, translateFigure(seed, [40, 100]));

drawLinesFromPoints(fractalContext, rotateFigure(seed, Math.PI * 1 / 6));

drawLinesFromPoints(fractalContext, scaleFigure(seed, 0.75));
*/

function drawLineFractal(fractalSeed, firstFigure, iterations) {
    // matrix to hold all iterations
    var newMatrix = [];
    // matrix to hold 1 iteration before it is passed to the other matrix
    var matrix;
    var startPoint;
    var endPoint;
    // matrix to hold the rotated, scaled, and translated seed values
    var transformSeed;

    // Angle Variables: 
    // angle that you want to rotate to
    var targetAngle;
    // seedAngle + angleChange = targetAngle, angleChange = targetAngle - seedAngle
    // angle that you want to rotate by
    var angleChange;
    // finds angle between the first and last points of the seed
    var seedAngle = findAngle(fractalSeed[0], fractalSeed[fractalSeed.length - 1]);
    
    // Distance Variables
    // distance that you want to scale up/down to
    var targetDistance;
    // seedDistance * distanceChange = targetDistance, distanceChange = targetDistance / seedDistance
    // scaling factor that you want to multiply by
    var distanceChange;
    // finds distance between the first and last points of the seed
    var seedDistance = findDistance(fractalSeed[0], fractalSeed[fractalSeed.length - 1]);
    // prevents the function from dividing by 0
    if (seedDistance === 0) {
        seedDistance = 1;
    }
    
    // Translation Variables:
    var targetPoint;
    
    var i; // iterator for fractal iterations
    var j; // iterator for number of points per iteration
    var k; // iterator for transformSeed
    
    newMatrix[0] = firstFigure;
    
    for (i = 1; i <= iterations; i++) {
        matrix = [];
        // iterates through all points of the most recent fractal iteration
        // replaces lines with the seed and adds the new coordinates to the next layer of the matrix
        for (j = 1; j < newMatrix[i - 1].length; j++) {
            // getting start and end points
            startPoint = newMatrix[i - 1][j - 1];
            endPoint = newMatrix[i - 1][j];
            
            // rotation
            targetAngle = findAngle(startPoint, endPoint);
            angleChange = seedAngle - targetAngle;
            transformSeed = rotateFigure(fractalSeed, angleChange);
            
            // scaling
            targetDistance = findDistance(startPoint, endPoint);
            distanceChange = targetDistance / seedDistance;
            transformSeed = scaleFigure(transformSeed, distanceChange);
            
            // translation
            transformSeed = translateFigure(transformSeed, [startPoint, endPoint]);
            
            // putting transformSeed in the matrix (without including the last point, preventing overlap)
            for (i = 0; i < transformSeed.length - 1; i++) {
                matrix.push(transformSeed[i]);
            }
        }
        // adding the last value to matrix
        matrix.push(transformSeed[transformSeed.length - 1]);
        newMatrix.push(matrix);
    }
    return newMatrix;
}

let fractal = drawLineFractal(seed, originalFigure, 1);
drawLinesFromPoints(fractalContext, fractal[1]);
