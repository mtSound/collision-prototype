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
    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', 'black');
    svg.appendChild(circle);
}

//simple svg line function
function line(x1, y1, x2, y2, strWidth, id) {
    let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine.setAttribute('x1', x1);
    newLine.setAttribute('y1', y1);
    newLine.setAttribute('x2', x2);
    newLine.setAttribute('y2', y2);
    newLine.setAttribute('id', id);
    newLine.setAttribute('stroke-width', strWidth);
    newLine.setAttribute('stroke', 'url(#parent)');

    return newLine;
}

function arc(x1, y1, r, dx, dy, dir, strWidth, id){
    let newArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    // "M x1 y1" is the start point of the arc
    // "a rx ry" are the radii.
    // "ang" is the angle - only has an affect if the radii are different (currently 0) 
    // "large-arc flag" defines whether or not to draw a large-arc (1) or a small one (0) (currently 0) 
    // "dir" is the 'sweep-flag', which can be 1 for clock-wise or 0 for counter-clockwise (could be randomised)
    // "dx, dy" are the coordinates for the end of the arc, RELATIVE to the beginning of the arc
    //// I imagine the math will get complex if the radius isn't half the distance between x1,y1 and x2,y2...
    //// some kind of ratio could be used?

    //* relative negative x values move to the left, and relative negative y values move upwards.
    
    newArc.setAttribute('d', `M ${x1}, ${y1}
    a ${r} ${r} 0 0 ${dir} ${dx}, ${dy}`
    ); 
    newArc.setAttribute('id', id); 
    newArc.setAttribute('stroke-width', strWidth); 
    newArc.setAttribute('stroke', 'url(#parent)'); 
    newArc.setAttribute('fill', 'none');

    //console.log(newArc);
    svg.appendChild(newArc); 
}

function arcAbs(x1, y1, r, x2, y2, dir, strWidth, id){
    let newArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    // "M x1 y1" is the start point of the arc
    // "a rx ry" are the radii.
    // "ang" is the angle - only has an affect if the radii are different (currently 0) 
    // "large-arc flag" defines whether or not to draw a large-arc (1) or a small one (0) (currently 0) 
    // "dir" is the 'sweep-flag', which can be 1 for clock-wise or 0 for counter-clockwise (could be randomised)
    // "x2, y2" are the coordinates for the end of the arc
    //// I imagine the math will get complex if the radius isn't half the distance between x1,y1 and x2,y2...
    //// some kind of ratio could be used?

    //* absolute negative x and y values are interpreted as negative coordinates;
    
    newArc.setAttribute('d', `M ${x1}, ${y1}
    A ${r} ${r} 0 0 ${dir} ${x2}, ${y2}`
    ); 
    newArc.setAttribute('id', id); 
    newArc.setAttribute('stroke-width', strWidth); 
    newArc.setAttribute('stroke', 'url(#parent)'); 
    newArc.setAttribute('fill', 'none');

    //console.log(newArc);
    svg.appendChild(newArc); 
}
