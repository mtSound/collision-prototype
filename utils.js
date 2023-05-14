'use strict';

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BUTTON FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function stopSeq() {
    // clear the global coordArray and remove any svg elements from the canvas
    coordArray = [];
    svg.replaceChildren();
  }


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UTILITY FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// a simple function for rounding to a unit (eg. nearest 10, 100 etc.)
//// usage: round(37.89, 10) would output '40'
function round(num, roundTo) {
    let roundedNum = Math.round(num / roundTo) * roundTo
    return roundedNum;
}

// random number in a specified range, no rounding
function randNumLim(lower, upper) {
    let num = lower + Math.random() * (upper - lower);
    return num;
}

// combines above two functions
function randNumLimRounded(lower, upper, roundTo) {
    let num = Math.round((lower + Math.random() * (upper - lower)) / roundTo) * roundTo;
    return num;
}

// checks coordinates and randomises the angle (so the lines are always projected toward the centre of the page)
function angDir(x, y) {
    let ang;
    //case 1 - if the x & y pos is in the top left of the canvas, set the angle to 270-360
    if (x > 0 && x < width / 2 && y > 0 && y < height / 2) {
        ang = randNumLim(270, 360);
        return ang;
        //case 2 - if the x & y pos is in the bottom left of the canvas, set the angle to 0-90
    } else if (x > 0 && x < width / 2 && y > height / 2 && y < height) {
        ang = randNumLim(0, 90);
        return ang;
        //case 3 - if the x & y pos is in the top right of the canvas, set the angle to 180-270
    } else if (x > width / 2 && x < width && y > 0 && y < height / 2) {
        ang = randNumLim(180, 270);
        return ang;
        //case 3 - if the x & y pos is in the bottom right of the canvas, set the angle to 90-180
    } else {
        ang = randNumLim(90, 180);
        return ang;
    }
}


// check if an object is present in an array
// it also performs some rounding so that close matches are also evaluated (within +/- resolution)
function arrContainsObject(obj, arr) {
    for (let i = 0; i < arr.length; i++) {
        if ((arr[i].x >= (obj.x - resolution) && arr[i].x <= (obj.x + resolution)) && (arr[i].y >= (obj.y - resolution) && arr[i].y <= (obj.y + resolution))) {
            return true;
        }
    }
    return false;
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SVG DRAWING FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// you can use this to track collision points
function makeCircle(x, y, r) {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", r);
    circle.setAttribute("fill", 'black');
    svg.appendChild(circle);
}

//simple svg line function
function line(x1, y1, x2, y2, strWidth, id) {
    let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    newLine.setAttribute('x1', x1);
    newLine.setAttribute('y1', y1);
    newLine.setAttribute('x2', x2);
    newLine.setAttribute('y2', y2);
    newLine.setAttribute('id', id);
    newLine.setAttribute('stroke-width', strWidth);
    newLine.setAttribute('stroke', 'url(#parent)');

    return newLine;
}
