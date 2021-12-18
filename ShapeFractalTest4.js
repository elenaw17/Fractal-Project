// Shape Fractal Generation Test 4
// Elena Wheatley
// 12/17/21

function drawIncreaseSidesCanvas(contextVar) {
    
    contextVar.beginPath();
    contextVar.moveTo(12, 3);
    contextVar.lineTo(12, 21);
    
    contextVar.moveTo(3, 12);
    contextVar.lineTo(21, 12);
    
    contextVar.lineWidth = 4;
    contextVar.strokeStyle = 'black';
    contextVar.stroke();
}

function drawSideNumberCanvas(contextVar, iterations) {
    
    contextVar.clearRect(0, 0, 48, 24);
    
    contextVar.font = "24px Arial";
    contextVar.fillText(iterations, 16, 20);
}

function drawDecreaseSidesCanvas(contextVar) {
    
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
    //contextVar.beginPath();
    contextVar.moveTo(xCoord, yCoord);
    cornersArray.push([xCoord, yCoord]);
    
    for (angle = angle + angleChange; angle < Math.PI * 2; angle += angleChange) {
        xCoord = xCenter + (radius * Math.cos(angle));
        yCoord = yCenter + (radius * Math.sin(angle));
        //contextVar.lineTo(xCoord, yCoord);
        cornersArray.push([xCoord, yCoord]);
    }
    
    /*
    contextVar.closePath();
    contextVar.stroke();
    
    contextVar.fillStyle = 'black';
    contextVar.fill();
    */
    return cornersArray;
}

function drawPolygonFromPoints(pointMatrix, contextVar) {
    contextVar.beginPath();
    contextVar.moveTo(pointMatrix[0][0], pointMatrix[0][1]);
    var i;
    
    for (i = 1; i < pointMatrix.length; i++) {
        contextVar.lineTo(pointMatrix[i][0], pointMatrix[i][1]);
    }
    
    contextVar.closePath();
    contextVar.stroke();
    
    contextVar.fillStyle = 'black';
    contextVar.fill();
}


// canvas and context variables
var polyCanvas = document.getElementById("polygon");
var polyCtx = polyCanvas.getContext("2d");

var sIncrCanvas = document.getElementById("decreaseSides");
var sIncrCtx = sIncrCanvas.getContext("2d");

var sNumCanvas = document.getElementById("sideNumber");
var sNumCtx = sNumCanvas.getContext("2d");

var sDecrCanvas = document.getElementById("increaseSides");
var sDecrCtx = sDecrCanvas.getContext("2d");

// polygon data
var polyCenterX = polyCanvas.width / 2;
var polyCenterY = polyCanvas.height / 2;
var polyRadius = 100;
var polySides = 6;
var allIterations = 4;

var corners;


drawIncreaseSidesCanvas(sIncrCtx);

drawSideNumberCanvas(sNumCtx, polySides);

drawDecreaseSidesCanvas(sDecrCtx);

/*
corners = createRegularPolygon(polyCenterX, polyCenterY, polyRadius, polySides, polyCtx);
for (let i = 0; i < polySides; i++) {
    createRegularPolygon(corners[i][0], corners[i][1], polyRadius / 2, polySides, polyCtx);
}
drawPolygonFromPoints(corners, polyCtx);
*/

function createPolyFractal(polyMatrix, recentIteration, totalIterations, radius,
scaleConst, contextVar) {
    var i;
    var j;
    var k;
    var parentPolygon;
    var newPolygon;
    var sideNumber;
    
    var newMatrix = polyMatrix;
    var newLayer = [];
    
    /* 
    polyMatrix Layers:
    layer 1: each iteration
    layer 2: each shape in a specific iteration
    layer 3: each point in a specific shape
    */
    
    // recentIteration is most recent iteration (index number) contained in the matrix, must be at least 0
    for (i = recentIteration; i < totalIterations; i++) {
        radius /= 2;
        for (j = 0; j < polyMatrix[i].length; j++) {
            parentPolygon = polyMatrix[i][j];
            sideNumber = parentPolygon.length;
            for (k = 0; k < parentPolygon.length; k++) {
                newPolygon = createRegularPolygon(parentPolygon[k][0], parentPolygon[k][1], radius, sideNumber, contextVar);
                newLayer.push(newPolygon);
            }
        }
        newMatrix.push(newLayer);
        newLayer = [];
    }
    return newMatrix;
}

function drawPolyFractal(polyMatrix, totalIterations, contextVar) {
    if (polyMatrix.length >= totalIterations) {
        
        var i;
        var j;

        for (i = 0; i <= totalIterations; i++) {
            for (k = 0; k < polyMatrix[i].length; k++) {
                drawPolygonFromPoints(polyMatrix[i][k], contextVar);
            }
        }
    }
}



function increaseSides() {
    polySides++;
    sNumCtx.clearRect(0, 0, sNumCanvas.width, sNumCanvas.height);
    drawSideNumberCanvas(sNumCtx, polySides);
    polyCtx.clearRect(0, 0, polyCanvas.width, polyCanvas.height);
    
    corners = createRegularPolygon(polyCenterX, polyCenterY, polyRadius, polySides, polyCtx);
    for (let i = 0; i < polySides; i++) {
        createRegularPolygon(corners[i][0], corners[i][1], polyRadius / 2, polySides, polyCtx);
    drawPolygonFromPoints(corners, polyCtx);
    }
}

function decreaseSides() {
    if (polySides > 3) {
        polySides--;
    }
    sNumCtx.clearRect(0, 0, sNumCanvas.width, sNumCanvas.height);
    drawSideNumberCanvas(sNumCtx, polySides);
    polyCtx.clearRect(0, 0, polyCanvas.width, polyCanvas.height);

    corners = createRegularPolygon(polyCenterX, polyCenterY, polyRadius, polySides, polyCtx);
    for (let i = 0; i < polySides; i++) {
        createRegularPolygon(corners[i][0], corners[i][1], polyRadius / 2, polySides, polyCtx);
    drawPolygonFromPoints(corners, polyCtx);
    }
}


sIncrCanvas.addEventListener("click", increaseSides);
sDecrCanvas.addEventListener("click", decreaseSides);


var polygonFractal;
polygonFractal.push([]);
polygonFractal.push(createRegularPolygon(polyCenterX, polyCenterY, polyRadius, polySides, polyCtx));
polygonFractal = createPolyFractal(polygonFractal, 0, allIterations, polyRadius, 2, polyCtx);
drawPolyFractal(polygonFractal, allIterations, polyCtx);

