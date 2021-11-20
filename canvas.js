// First canvas JS document
// Elena Wheatley
// 11/19/21

// takes in rectangle center x and y values, returns an array of the 4 points
// each point is an array of the x and y values
function findRectCorners(rCenterX, rCenterY, rWidth, rHeight) {
    var topLeft = [rCenterX - (rWidth / 2), rCenterY - (rHeight / 2)];
    var topRight = [rCenterX + (rWidth / 2), rCenterY - (rHeight / 2)];
    var bottomLeft = [rCenterX - (rWidth / 2), rCenterY + (rHeight / 2)];
    var bottomRight = [rCenterX + (rWidth / 2), rCenterY + (rHeight / 2)];
    var cornerArray = [topLeft, topRight, bottomLeft, bottomRight];
    return cornerArray;
}

function createRect(rCenterX, rCenterY, rWidth, rHeight) {
    context.rect(rectCenterX - (rectWidth / 2), rectCenterY - (rectHeight / 2), rectWidth, rectHeight);
}

function addToRectArray(rCenterX, rCenterY, rWidth, rHeight, layer, rArray) {
    var newRectangle = [rCenterX, rCenterY, rWidth, rHeight];
    rArray[layer].push(newRectangle);
}

var canvas = document.getElementById("canvas1");
var context = canvas.getContext("2d");

// coordinates of center point of starting rectangle
var rectCenterX = 200;
var rectCenterY = 200;

// width and height of starting rectangle
var rectWidth = 100;
var rectHeight = 100;

var rectLayer = 0;
var allRectangles = [];
var totalCorners = 4;

// number of fractal iterations
var totalLayers = 6;

var i;
var j;

var rectangle;
var corners;

allRectangles.push([]);
addToRectArray(rectCenterX, rectCenterY, rectWidth, rectHeight, rectLayer, allRectangles);
context.rect(rectCenterX - (rectWidth / 2), rectCenterY - (rectHeight / 2), rectWidth, rectHeight);
rectLayer++;

/*
var corners = findRectCorners(rectCenterY, rectCenterY, rectWidth, rectHeight);
rectWidth /= 2;
rectHeight /= 2;
var newRectangles;
for (let i = 0; i < totalCorners; i++) {
    rectCenterX = corners[i][0];
    rectCenterY = corners[i][1];
    createRect(rectCenterX, rectCenterY, rectWidth, rectHeight);
}
totalCorners *= 4;
rectLayer++;
*/

for (rectLayer = 1; rectLayer < totalLayers; rectLayer++) {
    allRectangles.push([]);
    for (i = 0; i < allRectangles[rectLayer - 1].length; i++) {
        rectangle = allRectangles[rectLayer - 1][i];
        rectCenterX = rectangle[0];
        rectCenterY = rectangle[1];
        rectWidth = rectangle[2];
        rectHeight = rectangle[3];
        corners = findRectCorners(rectCenterX, rectCenterY, rectWidth, rectHeight);
        rectWidth /= 2;
        rectHeight /= 2;
        for (j = 0; j < 4; j++) {
            rectCenterX = corners[j][0];
            rectCenterY = corners[j][1];
            addToRectArray(rectCenterX, rectCenterY, rectWidth, rectHeight, rectLayer, allRectangles);
            createRect(rectCenterX, rectCenterY, rectWidth, rectHeight);
        }
    }
}

context.stroke();
context.fill();


/*
for (let k = 0; k < allRectangles.length; k++) {
    context.fillText(allRectangles[k], 10, 20 + 10 * k);
}
*/

