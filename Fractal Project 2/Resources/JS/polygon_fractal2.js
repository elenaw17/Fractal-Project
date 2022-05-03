
// Shape Fractal SVG (test 5?)
// Elena Wheatley
// 1/13/21 ?

var svgDoc = document.getElementById("shapeFractal");
var poly1 = document.getElementById("poly1");
var increaseIterations = document.getElementById("increaseIterations");
var decreaseIterations = document.getElementById("decreaseIterations");
var iterationCount = document.getElementById("iterationCount");

var documentation = document.createElement('p');
document.body.appendChild(documentation);

var sides = 4;
var radius = 100;
var centerX = 200;
var centerY = 200;
var allIterations = 1;
var finishedIterations = 0;
var divisor = 2;

function convertCornersArrayToString(cornersArray) {
    var i = 0;
    var cornersString = `${cornersArray[i][0]},${cornersArray[i][1]}`;
    for (i = 1; i < cornersArray.length; i++) {
        cornersString += ` ${cornersArray[i][0]},${cornersArray[i][1]}`;
    }
    return cornersString;
}

function createRegularPolygon(xCenter, yCenter, radius, sides) {
    
    var angleChange = 2 * Math.PI / sides;
    
    // creates an array of the coordinates of each corner of the polygon
    var cornersArray = [];
    
    var xCoord;
    var yCoord;
    // When angle starts at angleChange / 2, it makes the last side parallel to the y axis
    for (var angle = angleChange / 2; angle < Math.PI * 2; angle += angleChange) {
        xCoord = xCenter + (radius * Math.cos(angle));
        yCoord = yCenter + (radius * Math.sin(angle));
        cornersArray.push([xCoord, yCoord]);
    }
    return cornersArray;
}

// iterations start at 1 (only a single regular polygon)
function createFractalArray(pointArray, xCenter, yCenter, firstRadius, polygonSides, 
radiusDivisor, completedIterations, totalIterations) {
    
    var singleIterationArray;
    var radius = firstRadius;
    var newPolygon;
    
    if (completedIterations === 0) {
        pointArray = [];
        newPolygon = createRegularPolygon(xCenter, yCenter, radius, polygonSides);

        //singleIterationArray = createRegularPolygon(xCenter, yCenter, radius, polygonSides);
        pointArray[0] = newPolygon;
        completedIterations++;
    }
    
    var i;
    var j;
    var k;
    radius /= Math.pow(radiusDivisor, completedIterations - 1);
    for (i = completedIterations; i < totalIterations; i++) {
        
        radius /= radiusDivisor;
        singleIterationArray = [];
        //pointArray[i] = [];
        
        for (j = 0; j < pointArray[i - 1].length; j++) {
            xCenter = pointArray[i - 1][j][0];
            yCenter = pointArray[i - 1][j][1];
            newPolygon = createRegularPolygon(xCenter, yCenter, radius, polygonSides);
            
            // adding each point to singleIterationArray (each surrounded by the corner point)
            singleIterationArray.push([xCenter, yCenter]);
            for (k = 0; k < polygonSides; k++) {
                singleIterationArray.push(newPolygon[k]);
            }
            singleIterationArray.push(newPolygon[0]);
            singleIterationArray.push([xCenter, yCenter]);
        }
        pointArray.push(singleIterationArray);
    }
    return pointArray;
}

// max iterations set to 10 (the picture goes blank after specific numbers of iterations for different shapes)
function increaseFractalIterations() {
    if (allIterations <= 9) {
        finishedIterations = fractalArray.length;
        allIterations++;
        if (finishedIterations < allIterations) {
            fractalArray = createFractalArray(fractalArray, centerX, centerY, radius, sides, divisor, finishedIterations, allIterations);
        }
        fractalString = convertCornersArrayToString(fractalArray[allIterations - 1]);
        poly1.setAttribute("points", fractalString);
        iterationCount.innerHTML = allIterations;
        finishedIterations = fractalArray.length; //just to record the number of finished iterations, not necessary
    }
}

// min iterations set to 1
function decreaseFractalIterations() {
    if (allIterations >= 2) {
        allIterations--;
        fractalString = convertCornersArrayToString(fractalArray[allIterations - 1]);
        poly1.setAttribute("points", fractalString);
        iterationCount.innerHTML = allIterations;
    }
}

var fractalArray = createFractalArray(fractalArray, centerX, centerY, radius, sides, divisor, finishedIterations, allIterations);
var fractalString = convertCornersArrayToString(fractalArray[allIterations - 1]);
poly1.setAttribute("points", fractalString);
iterationCount.innerHTML = allIterations;

increaseIterations.addEventListener("click", increaseFractalIterations);
decreaseIterations.addEventListener("click", decreaseFractalIterations);