// mandelbrot.js
// Mandelbrot
// 12/21/21

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

// number of pixels is 1 off from actual number
var xPixels = 300;
var yPixels = 300;

var minX = -2.2;
var maxX = 0.8;
var minY = -1.5;
var maxY = 1.5;

var rectWidth = canvasWidth / xPixels;
var rectHeight = canvasHeight / yPixels;

/*
// bounds for julia set
minX = -2;
maxX = 2;
minY = -2;
maxY = 2;
*/

var boundsArray = [minX, maxX, minY, maxY];

var functionIterations = 32;

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

createPointArray(canvasWidth, canvasHeight, xPixels, yPixels, maxX, maxY, minX, minY, allPoints);


function iterateMandelbrotFunction(varArray, iterations) {
        
        var j;

        /*
        // for julia set:
        cX = -1;
        cY = 0;
        zX0 = pointArray[i][0];
        zY0 = pointArray[i][1];
        */
        
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

function generateMandelbrot(pointArray, iterations, fractalCtx) {
    
    var i;

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
        
        cX = pointArray[i][0];
        cY = pointArray[i][1];
        
        zX0 = pointArray[i][0];
        zY0 = pointArray[i][1];
        
        iterationVarArray = [cX, cY, zX0, zY0, zX1, zY1];
        
        distanceFromOrigin = iterateMandelbrotFunction(iterationVarArray, iterations / 16);
        if (distanceFromOrigin > 2) {
            fillColor = "rgb(50, 50, 50)";
        }
        else {
            distanceFromOrigin = iterateMandelbrotFunction(iterationVarArray, 
            iterations / 8 - iterations / 16);
            
            if (distanceFromOrigin > 2) {
                fillColor = "rgb(90, 90, 90)";
            }
            else {
                distanceFromOrigin = iterateMandelbrotFunction(iterationVarArray, 
                iterations / 4 - iterations / 8);
                
                if (distanceFromOrigin > 2) {
                    fillColor = "rgb(130, 130, 130)";
                }
                else {
                    distanceFromOrigin = iterateMandelbrotFunction(iterationVarArray, 
                    iterations / 2 - iterations / 4);
                    
                    if (distanceFromOrigin > 2) {
                        fillColor = "rgb(170, 170, 170)";
                    }
                    else {
                        distanceFromOrigin = iterateMandelbrotFunction(iterationVarArray, 
                        iterations - iterations / 2);
                        
                        if (distanceFromOrigin > 2) {
                            fillColor = "rgb(250, 250, 250)";
                        }
                        else if (distanceFromOrigin <= 2) {
                            fillColor = "rgb(0, 0, 0)";
                        }
                        // there might be a glitch but this represents another layer outside the set
                        else {
                            fillColor = "rgb(210, 210, 210)";
                        }
                    }
                }
            }
        }
        
        /*
        var distanceFromOrigin = iterateMandelbrotFunction(pointArray, iterations, i);
        
        if (distanceFromOrigin <= 2) {
            fillColor = "rgb(0, 0, 0)";
        }
        else if (iterateMandelbrotFunction(pointArray, iterations / 2, i) <= 2) {
            fillColor = "rgb(255, 0, 0)";
        }
        else if (iterateMandelbrotFunction(pointArray, iterations / 4, i) <= 2) {
            fillColor = "orange";
        }
        else if (iterateMandelbrotFunction(pointArray, iterations / 8, i) <= 2) {
            fillColor = "yellow";
        }
        else {
            fillColor = "white";
        }
        */
        pointArray[i].push(fillColor);
    }
}

generateMandelbrot(allPoints, functionIterations, fractalCtx);

for (i = 0; i < allPoints.length; i++) {
    //fractalCtx.rect(allPoints[i][2] - rectWidth / 2, allPoints[i][3] - rectHeight / 2, rectWidth, rectHeight);
    fractalCtx.fillStyle = allPoints[i][4];
    fractalCtx.fillRect(allPoints[i][2] - rectWidth / 2, allPoints[i][3] - rectHeight / 2, rectWidth, rectHeight);
    fractalCtx.stroke();
}

var documentation = document.createElement("p");
documentation.id = "documentation";
documentation.innerHTML = allPoints.length + " rectangles";
document.body.appendChild(documentation);