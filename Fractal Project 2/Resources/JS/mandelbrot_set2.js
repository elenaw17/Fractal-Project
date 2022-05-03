
// Mandelbrot 3
// Elena Wheatley
// 1/26/22

/* 
an array of all point values that are tested
nested arrays have 4 values: the first 2 are for the original c values
and the last 2 are for the original c values converted to canvas coords
*/

var allPoints = [];

var fractalCanvas = document.getElementById("fractal");
var fractalCtx = fractalCanvas.getContext("2d");

var canvasWidth = fractalCanvas.width;
var canvasHeight = fractalCanvas.height;

var shiftConstant = 0.5;
var zoomMultiplier = 2;

// number of pixels is 1 off from actual number
var xPixels = 300;
var yPixels = 300;

var juliaSet = false;
var juliaSetCoord = [-0.8, 0.2];

if (juliaSet) {
    var minX = -2;
    var maxX = 2;
    var minY = -2;
    var maxY = 2;
}
else {
    var minX = -2.2;
    var maxX = 0.8;
    var minY = -1.5;
    var maxY = 1.5;
}

var boundsArray = [minX, maxX, minY, maxY];

var rectWidth = canvasWidth / xPixels + 1;
var rectHeight = canvasHeight / yPixels + 1;

var functionIterations = 28;
var iterationsToDoAtOnce = 1;

var documentation = document.createElement("p");
documentation.id = "documentation";
document.body.appendChild(documentation);

var i;


/*
widthOfCanvas: width of the canvas
heightOfCanvas: height of the canvas
xRects: number of rectangles across the x axis
yRects: number of rectangles across the y axis
maxX, minX, maxY, minY: maximum/minimum x and y values (original values)
pointArray: an empty array to hold the point values
*/
function createPointArray(widthOfCanvas, heightOfCanvas, xRects, yRects, maxX, maxY, minX, minY, pointArray) {
    // iteration variables
    var i;
    var j;
    
    var xValue;
    var yValue;
    
    var canvasXValue;
    var canvasYValue;
    
    var xRange = maxX - minX;
    var yRange = maxY - minY;
    
    var rectWidth = xRange / xRects;
    var rectHeight = yRange / yRects;
    
    for (i = 0; i <= xRects; i++) {
        for (j = 0; j <= yRects; j++) {
            xValue = (i * rectWidth) + minX;
            yValue = (j * rectHeight) + minY;
            pointArray.push([xValue, yValue]);
        }
    }
    
    /* 
    Part 2: adding modified coords for the canvas
    pointArray must have all points in nested arrays of length 2: index 0: x value, index 1: y value
    */
    
    
    // scaling values (ratio of canvas coord. value / original value)
    var xScaling = widthOfCanvas / xRange;
    var yScaling = heightOfCanvas / yRange;
    
    // translation values (add to coords to make the min 0)
    var xTranslation = -minX;
    var yTranslation = maxY; // y variables are reflected, so the max is lowest
    
    for (i = 0; i < pointArray.length; i++) {
        // variables to hold modified coords.
        xValue = pointArray[i][0];
        yValue = pointArray[i][1];
        
        // flipping y coord (since the canvas counts from top to bottom)
        yValue = -yValue;
        
        // making all values positive
        xValue += xTranslation;
        yValue += yTranslation;
        
        // scaling all values
        xValue *= xScaling;
        yValue *= yScaling;
        
        pointArray[i].push(xValue);
        pointArray[i].push(yValue);
    }
}

function iterateMandelbrotFunction(varArray, iterations) {
        
        var j;
        // iterate z = z^2 + c
        // (x + iy)^2 = (x^2 - y^2) + i(2xy)
        for (j = 0; j < iterations; j++) {
            // Mandelbrot
            varArray[4] = (varArray[2] * varArray[2]) - (varArray[3] * varArray[3]) + varArray[0];
            varArray[5] = (2 * varArray[2] * varArray[3]) + varArray[1];
            
            /*
            // Mandelbrot but with z^3 instead of z^2
            zX1 = Math.pow(zX0, 3) - zX0 * Math.pow(zY0, 2) - 2 * zX0 * Math.pow(zY0, 2) + cX;
            zY1 = zY0 * Math.pow(zX0, 2) - Math.pow(zY0, 3) + 2 * Math.pow(zX0, 2) * zY0 + cY;
            */
            
            varArray[2] = varArray[4];
            varArray[3] = varArray[5];
        }
    
    var totalDistance = Math.pow((varArray[4] * varArray[4]) + (varArray[5] * varArray[5]), 0.5);
    return totalDistance;
}

function generateMandelbrot(pointArray, iterations, fractalCtx, iterationAddition, juliaSet, juliaSetCoord) {
    
    var i;
    var j;

    // these are the x and y values of the constants
    var cX;
    var cY;
    // the x and y values used to iterate the function (equal to past result of the function)
    var zX0;
    var zY0;
    // the x and y values that are the result of the function
    var zX1;
    var zY1;
    
    var iterationVarArray = [];
    
    var distanceFromOrigin;
    
    var fillColor;
    
    // iterating through each pixel
    for (i = 0; i < pointArray.length; i++) {
        
        if (juliaSet) {
            cX = juliaSetCoord[0];
            cY = juliaSetCoord[1];
        }
        else {
            cX = pointArray[i][0];
            cY = pointArray[i][1];
        }
        
        zX0 = pointArray[i][0];
        zY0 = pointArray[i][1];
        
        iterationVarArray = [cX, cY, zX0, zY0, zX1, zY1];
        distanceFromOrigin = Math.sqrt(zX0 * zX0 + zY0 * zY0);
        if (distanceFromOrigin > 2) {
            fillColor = "hsl(0, 70%, 50%)";
        }
        else {
            var colorSelector;
            for (j = 0; j < iterations && distanceFromOrigin < 2; j += iterationAddition) {
                distanceFromOrigin = iterateMandelbrotFunction(iterationVarArray, iterationAddition);
                if (distanceFromOrigin > 2) {
                    colorSelector = (j / iterationAddition) % 14;
                    switch (colorSelector) {
                        case 0: 
                        fillColor = "hsl(0, 70%, 50%)";
                        break;
                        case 1: 
                        fillColor = "hsl(15, 70%, 50%)";
                        break;
                        case 2: 
                        fillColor = "hsl(30, 70%, 50%)";
                        break;
                        case 3: 
                        fillColor = "hsl(45, 70%, 50%)";
                        break;
                        case 4: 
                        fillColor = "hsl(60, 70%, 50%)";
                        break;
                        case 5: 
                        fillColor = "hsl(90, 70%, 50%)";
                        break;
                        case 6: 
                        fillColor = "hsl(120, 70%, 50%)";
                        break;
                        case 7: 
                        fillColor = "hsl(150, 70%, 50%)";
                        break;
                        case 8: 
                        fillColor = "hsl(180, 70%, 50%)";
                        break;
                        case 9: 
                        fillColor = "hsl(210, 70%, 50%)";
                        break;
                        case 10: 
                        fillColor = "hsl(240, 70%, 50%)";
                        break;
                        case 11: 
                        fillColor = "hsl(270, 70%, 50%)";
                        break;
                        case 12: 
                        fillColor = "hsl(300, 70%, 50%)";
                        break;
                        case 13: 
                        fillColor = "hsl(330, 70%, 50%)";
                        break;
                        default: 
                        fillColor = "white";
                    }
                }
            }
            if (distanceFromOrigin < 2) {
                fillColor = "black";
            }
        }
        pointArray[i].push(fillColor);
    }
}

function drawRectangles(pointArray, ctxVar, pxWidth, pxHeight) {
    
for (var i = 0; i < pointArray.length; i++) {
        ctxVar.fillStyle = pointArray[i][4];
        ctxVar.fillRect(pointArray[i][2] - pxWidth / 2, pointArray[i][3] - pxHeight / 2, pxWidth, pxHeight);
    }
}


// goes with zoomIn key
// changes bounds and decreases number of rectangles to match the zoom
function zoomIn() {
    
    var xRadius = (maxX - minX) / 2;
    var yRadius = (maxY - minY) / 2;
    var centerX = (maxX + minX) / 2;
    var centerY = (maxY + minY) / 2;
    
    minX = centerX - (xRadius / zoomMultiplier);
    maxX = centerX + (xRadius / zoomMultiplier);
    minY = centerY - (yRadius / zoomMultiplier);
    maxY = centerY + (yRadius / zoomMultiplier);
    
    createPointArray(canvasWidth, canvasHeight, xPixels, yPixels, maxX, maxY, minX, minY, allPoints);
    generateMandelbrot(allPoints, functionIterations, fractalCtx, iterationsToDoAtOnce, juliaSet, juliaSetCoord);
    
    fractalCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    drawRectangles(allPoints, fractalCtx, rectWidth, rectHeight);
    
    /*
    topBound.innerHTML = maxY;
    bottomBound.innerHTML = minY;
    leftBound.innerHTML = minX;
    rightBound.innerHTML = maxX;
    */
}

// goes with zoomOut key
// changes bounds and increases number of rectangles to match the zoom
function zoomOut() {
    
    var xRadius = (maxX - minX) / 2;
    var yRadius = (maxY - minY) / 2;
    var centerX = (maxX + minX) / 2;
    var centerY = (maxY + minY) / 2;
    
    minX = centerX - (xRadius * zoomMultiplier);
    maxX = centerX + (xRadius * zoomMultiplier);
    minY = centerY - (yRadius * zoomMultiplier);
    maxY = centerY + (yRadius * zoomMultiplier);
    
    createPointArray(canvasWidth, canvasHeight, xPixels, yPixels, maxX, maxY, minX, minY, allPoints);
    generateMandelbrot(allPoints, functionIterations, fractalCtx, iterationsToDoAtOnce, juliaSet, juliaSetCoord);
    
    fractalCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    drawRectangles(allPoints, fractalCtx, rectWidth, rectHeight);
    
    /*
    topBound.innerHTML = maxY;
    bottomBound.innerHTML = minY;
    leftBound.innerHTML = minX;
    rightBound.innerHTML = maxX;
    */
}

// goes with up key
function shiftDown() {
    
    var xRadius = (maxX - minX) / 2;
    var yRadius = (maxY - minY) / 2;
    
    var shift = yRadius * 2 * shiftConstant;
    
    minY = minY + shift;
    maxY = maxY + shift;
    
    createPointArray(canvasWidth, canvasHeight, xPixels, yPixels, maxX, maxY, minX, minY, allPoints);
    generateMandelbrot(allPoints, functionIterations, fractalCtx, iterationsToDoAtOnce, juliaSet, juliaSetCoord);
    
    fractalCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    drawRectangles(allPoints, fractalCtx, rectWidth, rectHeight);
    
    /*
    topBound.innerHTML = maxY;
    bottomBound.innerHTML = minY;
    leftBound.innerHTML = minX;
    rightBound.innerHTML = maxX;
    */
}

// goes with down key
function shiftUp() {
    
    var xRadius = (maxX - minX) / 2;
    var yRadius = (maxY - minY) / 2;
    
    var shift = -1 * yRadius * 2 * shiftConstant;
    
    minY = minY + shift;
    maxY = maxY + shift;
    
    createPointArray(canvasWidth, canvasHeight, xPixels, yPixels, maxX, maxY, minX, minY, allPoints);
    generateMandelbrot(allPoints, functionIterations, fractalCtx, iterationsToDoAtOnce, juliaSet, juliaSetCoord);
    
    fractalCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    drawRectangles(allPoints, fractalCtx, rectWidth, rectHeight);
    
    /*
    topBound.innerHTML = maxY;
    bottomBound.innerHTML = minY;
    leftBound.innerHTML = minX;
    rightBound.innerHTML = maxX;
    */
}

// goes with left key
function shiftRight() {
    
    var xRadius = (maxX - minX) / 2;
    var yRadius = (maxY - minY) / 2;
    
    var shift = -1 * xRadius * 2 * shiftConstant;
    
    minX = minX + shift;
    maxX = maxX + shift;
    
    createPointArray(canvasWidth, canvasHeight, xPixels, yPixels, maxX, maxY, minX, minY, allPoints);
    generateMandelbrot(allPoints, functionIterations, fractalCtx, iterationsToDoAtOnce, juliaSet, juliaSetCoord);
    
    fractalCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    drawRectangles(allPoints, fractalCtx, rectWidth, rectHeight);
    
    /*
    topBound.innerHTML = maxY;
    bottomBound.innerHTML = minY;
    leftBound.innerHTML = minX;
    rightBound.innerHTML = maxX;
    */
}

// goes with right key
function shiftLeft() {
    
    var xRadius = (maxX - minX) / 2;
    var yRadius = (maxY - minY) / 2;
    
    var shift = xRadius * 2 * shiftConstant;
    
    minX = minX + shift;
    maxX = maxX + shift;
    
    createPointArray(canvasWidth, canvasHeight, xPixels, yPixels, maxX, maxY, minX, minY, allPoints);
    generateMandelbrot(allPoints, functionIterations, fractalCtx, iterationsToDoAtOnce, juliaSet, juliaSetCoord);
    
    fractalCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    drawRectangles(allPoints, fractalCtx, rectWidth, rectHeight);
    
    /*
    topBound.innerHTML = maxY;
    bottomBound.innerHTML = minY;
    leftBound.innerHTML = minX;
    rightBound.innerHTML = maxX;
    */
}

createPointArray(canvasWidth, canvasHeight, xPixels, yPixels, maxX, maxY, minX, minY, allPoints);
generateMandelbrot(allPoints, functionIterations, fractalCtx, iterationsToDoAtOnce, juliaSet, juliaSetCoord);
drawRectangles(allPoints, fractalCtx, rectWidth, rectHeight);

documentation.innerHTML = allPoints.length + " rectangles";

document.getElementById("zoomIn").addEventListener("click", zoomIn);
document.getElementById("zoomOut").addEventListener("click", zoomOut);
document.getElementById("up").addEventListener("click", shiftDown);
document.getElementById("down").addEventListener("click", shiftUp);
document.getElementById("left").addEventListener("click", shiftRight);
document.getElementById("right").addEventListener("click", shiftLeft);

