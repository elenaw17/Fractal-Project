// Polygon Fractals
// index.js
// Elena Wheatley
// 11/24/21


/**** Functions **************************************************************/

function increaseIterations(iterations) {
    if (iterations < 8) {
        iterations++;
    }
    return iterations;
}

function decreaseIterations(iterations) {
    if (iterations > 1) {
        iterations--;
    }
    return iterations;
}

function drawIncreaseIterationsCanvas(contextVar) {
    
    contextVar.beginPath();
    contextVar.moveTo(12, 3);
    contextVar.lineTo(12, 21);
    
    contextVar.moveTo(3, 12);
    contextVar.lineTo(21, 12);
    
    contextVar.lineWidth = 4;
    contextVar.strokeStyle = 'black';
    contextVar.stroke();
}

function drawIterationNumberCanvas(contextVar, iterations) {
    
    contextVar.clearRect(0, 0, 48, 24);
    
    contextVar.font = "24px Arial";
    contextVar.fillText(iterations, 16, 20);
}

function drawDecreaseIterationsCanvas(contextVar) {
    
    contextVar.beginPath();
    contextVar.moveTo(3, 12);
    contextVar.lineTo(21, 12);
    
    contextVar.lineWidth = 4;
    contextVar.strokeStyle = 'black';
    contextVar.stroke();
}

// creates a regular polygon and returns an array of the coordinates of its corners
function createRegularPolygon(xCenter, yCenter, radius, sides, contextVar) {
var angleChange = 2 * Math.PI / sides;
    
    // creates an array of the coordinates of each corner of the polygon
    var cornersArray = [];

    // This makes the last side parallel to the y axis
    var angle = angleChange / 2;
    var xCoord = xCenter + (radius * Math.cos(angle));
    var yCoord = yCenter + (radius * Math.sin(angle));
    contextVar.beginPath();
    contextVar.moveTo(xCoord, yCoord);
    cornersArray.push([xCoord, yCoord]);
    
    for (angle = angle + angleChange; angle < Math.PI * 2; angle += angleChange) {
        xCoord = xCenter + (radius * Math.cos(angle));
        yCoord = yCenter + (radius * Math.sin(angle));
        contextVar.lineTo(xCoord, yCoord);
        cornersArray.push([xCoord, yCoord]);
    }
    
    contextVar.closePath();
    contextVar.stroke();
    
    contextVar.fillStyle = 'black';
    contextVar.fill();
    
    return cornersArray;
}

// polygon fractal creation function
// uses the same variables that are used in createRegularPolygon
// cornersArray: an array that holds all corners of the polygons (passed by reference)
// divisor: a constant that represents how much smaller the shapes become for each iteration
// totalIterations: the number of iterations used to create the fractal
// also uses the function createRegularPolygon
function createPolyFractal(firstCenterX, firstCenterY, firstRadius, sides, contextVar, cornersArray, divisor, totalIterations) {
    
    // iterator variables
    var iterationNum;
    var polyNum; // number of polygons created for current iteration
    var cornerIteration; // iterates through corners to set centers of shapes
    
    // other variables
    var currentIterationCorners;
    var polyCreation;
    var centerX = firstCenterX;
    var centerY = firstCenterY;
    var radius = firstRadius;
    
    
    // creating the first polygon and adding its corners to cornersArray
    polyCreation = createRegularPolygon(firstCenterX, firstCenterX, firstRadius, sides, contextVar);
    cornersArray.push([]); // should probably use .push for arrays
    cornersArray[0].push(polyCreation);
    
    for (iterationNum = 1; iterationNum < totalIterations /* This is because it has already done 1 iteration */; iterationNum++) {
        
        radius /= divisor;
        currentIterationCorners = [];

        for (polyNum = 0; polyNum < cornersArray[iterationNum - 1].length /* This is because the first iteration corresponds to index 0 of cornersArray*/; polyNum++) {
            
            for (cornerIteration = 0; cornerIteration < sides; cornerIteration++) {
                centerX = cornersArray[iterationNum - 1][polyNum][cornerIteration][0];
                centerY = cornersArray[iterationNum - 1][polyNum][cornerIteration][1];
                
                polyCreation = createRegularPolygon(centerX, centerY, radius, sides, contextVar);
                currentIterationCorners.push(polyCreation);
            }
        }
        cornersArray.push(currentIterationCorners);
    }
}

// uses allIterations, iNumCtx, fractalCtx, polyCenterX, polyCenterY, polyRadius, polySides, allCorners, divisionConst
/*
function incrIterationsUpdate(fractalIterations, fractalIterationsContextVar, fractalContextVar, fractalCenterX, fractalCenterY, fractalRadius, fractalSides, fractalCornersArray, fractalDivisor) {
if (fractalIterations < 8) {
        fractalIterations++;
    }
    fractalContextVar.clearRect(0, 0, 400, 400);
    drawIterationNumberCanvas(fractalIterationsContextVar, fractalIterations);
    drawRectangleFractalCanvas(fractalCenterX, fractalCenterY, fractalRadius, fractalSides, fractalContextVar, fractalCornersArray, fractalDivisor, fractalIterations);
} */

// uses allIterations, iNumCtx, fractalCtx, polyCenterX, polyCenterY, polyRadius, polySides, allCorners, divisionConst
/*
function decrIterationsUpdate(iterations, iterationsContextVar, fractalContextVar, centerX, centerY, radius, sides, cornersArray, divisor) {
    if (fractalIterations > 1) {
        fractalIterations--;
    }
    fractalContextVar.clearRect(0, 0, 400, 400);
    drawIterationNumberCanvas(fractalIterationsContextVar, fractalIterations);
    drawRectangleFractalCanvas(fractalCenterX, fractalCenterY, fractalRadius, fractalSides, fractalContextVar, fractalCornersArray, fractalDivisor, fractalIterations);
} */


/**** Variable Creation? *****************************************************/

// canvas and context variables
var fractalCanvas = document.getElementById("fractal");
var fractalCtx = fractalCanvas.getContext("2d");

var iIncrCanvas = document.getElementById("decreaseIterations");
var iIncrCtx = iIncrCanvas.getContext("2d");

var iNumCanvas = document.getElementById("iterationNumber");
var iNumCtx = iNumCanvas.getContext("2d");

var iDecrCanvas = document.getElementById("increaseIterations");
var iDecrCtx = iDecrCanvas.getContext("2d");

// first polygon data
var polyCenterX = fractalCanvas.width / 2;
var polyCenterY = fractalCanvas.height / 2;
var polyRadius = 100;
var polySides = 6;

// other data
var divisionConst = 3;
var allIterations = 4;

// corner array
var allCorners = [];

/**** Drawing ****************************************************************/

/* 
allCorners = createRegularPolygon(polyCenterX, polyCenterY, polyRadius, polySides, fractalCtx);

var documentation = document.createElement("p");
document.body.appendChild(documentation);
documentation.innerHTML = allCorners;
*/

createPolyFractal(polyCenterX, polyCenterY, polyRadius, polySides, fractalCtx, allCorners, divisionConst, allIterations);

drawIncreaseIterationsCanvas(iIncrCtx);

drawIterationNumberCanvas(iNumCtx, allIterations);

drawDecreaseIterationsCanvas(iDecrCtx);

/*
// uses allIterations, iNumCtx, fractalCtx, polyCenterX, polyCenterY, polyRadius, polySides, allCorners, divisionConst
function incrIterationsUpdate() {
if (allIterations < 8) {
        allIterations++;
    }
    fractalContextVar.clearRect(0, 0, 400, 400);
    drawIterationNumberCanvas(iNumCtx, allIterations);
    //drawRectangleFractalCanvas(polyCenterX, polyCenterY, polyRadius, polySides, fractalCtx, allCorners, divisionConst, allIterations);
} 

// uses allIterations, iNumCtx, fractalCtx, polyCenterX, polyCenterY, polyRadius, polySides, allCorners, divisionConst
function decrIterationsUpdate() {
    if (allIterations > 1) {
        allIterations--;
    }
    fractalContextVar.clearRect(0, 0, 400, 400);
    drawIterationNumberCanvas(iNumCtx, allIterations);
    //drawRectangleFractalCanvas(polyCenterX, polyCenterY, polyRadius, polySides, fractalCtx, allCorners, divisionConst, allIterations);
}

iIncrCanvas.addEventListener('click', incrIterationsUpdate);
iDecrCanvas.addEventListener('click', decrIterationsUpdate);
*/
