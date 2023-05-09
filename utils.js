'use strict';

// just in case we need a global 'resolution' for the 'grid'
let resolution = 3;

// calling this on line 279 to map collisions (currently turned off)
function makeCircle(x, y) {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", "2");
    circle.setAttribute("fill", "black");
    svg.appendChild(circle);
}

//simple svg line function
function line(x1, y1, x2, y2, id) {
    let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    newLine.setAttribute('x1', x1);
    newLine.setAttribute('y1', y1);
    newLine.setAttribute('x2', x2);
    newLine.setAttribute('y2', y2);
    newLine.setAttribute('id', id);
    newLine.setAttribute('stroke-width', '1');
    newLine.setAttribute('stroke', 'url(#parent)');

    // currently storing in an array just in case any other data needs to be returned
    return [newLine];
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UTILITY FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// a simple function for rounding to a unit
// takes the number input, and a rounding value - which could be 10, 100, 1000 etc.
// https://www.loginradius.com/blog/engineering/16-javascript-hacks-for-optimization/
function round(num, roundTo) {
    let roundedNum = Math.round(num / roundTo) * roundTo
    return roundedNum;
}

// as above, but always rounds down
function floor(num, roundTo) {
    let roundedNum = Math.floor(num / roundTo) * roundTo
    return roundedNum;
}

// as above, but always rounds up
function ceil(num, roundTo) {
    let roundedNum = Math.ceil(num / roundTo) * roundTo
    return roundedNum;
}

// random number in a specified range, no rounding
function randNumLim(lower, upper) {
    let num = lower + Math.random() * (upper - lower);
    return num;
}

// combines above functions
function randNumLimRounded(lower, upper, roundTo) {
    let num = Math.round((lower + Math.random() * (upper - lower)) / roundTo) * roundTo;
    return num;
}

// // returns a 0 or a 1 - using for randomly generating rulesets
// function randBinary() {
//     return Math.round(Math.random());
// }


// // looks for matches in coordinates for lines
// function coordMatch(array1, array2) {
//     // cycles through the first array
//     for (let i = 0; i < array1.length; i++) {
//         // cycles through the second array for each loop of the first array
//         for (let j = 0; j < array2.length; j++) {
//             // if both the x and y properties of the objects in the arrays match, it returns 'true'
//             if (array1[i].x === array2[j].x && array1[i].y === array2[j].y) {
//                 // // return the matched coordinates
//                 // return [array1[i]];
//                 // or return the matched coordinates - resolution (the altered x,y vals for passing along)
//                 let adjustedCoords = [
//                     {
//                         x: array1[i].x - resolution,
//                         y: array1[i].y - resolution
//                     }
//                 ]
//                 return adjustedCoords;
//             }
//         }
//     }
// }

// //adds the animation to the x2,y2 properties of the line
// function animateXY(x1, y1, x2, y2) {
//     // animation for the x2 coordinates of the line
//     let animElementX2 = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
//     animElementX2.setAttribute('attributeName', 'x2');
//     animElementX2.setAttribute('from', x1);
//     animElementX2.setAttribute('to', x2);
//     // fill freeze stops the line from continuously animating
//     animElementX2.setAttribute('fill', 'freeze');
//     // is 0 sufficient here? or does it need to be offset somehow?
//     animElementX2.setAttribute('begin', '0');
//     // should duration be set, or randomised?
//     animElementX2.setAttribute('dur', '5');

//     let animElementY2 = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
//     // animation for the y2 coordinates of the line
//     animElementY2.setAttribute('attributeName', 'y2');
//     animElementY2.setAttribute('from', y1);
//     animElementY2.setAttribute('to', y2);
//     // fill freeze stops the line from continuously animating
//     animElementY2.setAttribute('fill', 'freeze');
//     // is 0 sufficient here? or does it need to be offset somehow?
//     animElementY2.setAttribute('begin', '0');
//     // should duration be set, or randomised?
//     animElementY2.setAttribute('dur', '5');

//     return [animElementX2, animElementY2];
// }



function createLinesArray(num) {
    let lineInstances = [];
  
    for (let i = 0; i < num; i++) {
      // randomise start positions
      let startX = randNumLim(0, width);
      let startY = randNumLim(0, height);
      let startAngle = randNumLim(0, 360);
      let startLength =  randNumLim(0, width);
      let animDuration = randNumLim(3,5);
      // Push a new instances to the end of the array
      lineInstances.push(new Line(startX, startY, startAngle, startLength, animDuration));
    }
  
    return lineInstances;
  }
  



class Line {
    constructor(x1, y1, angle, length, animDur) {
        this.x1 = round(x1, resolution);
        this.y1 = round(y1, resolution);
        this.length = length;
        this.animDur = animDur;
        this.quadrant;
        this.id = ("line_" + document.getElementsByTagName('line').length);
        this.svgElement;


        // A line won't be drawn if the angle is a multiple of 90deg (0, 90, 180, 270, 360)
        // switch statement to slightly adjust for these edge cases
        switch (angle % 90) {
            case 0:
                this.angle = angle + 1;
                break;
            default:
                this.angle = angle;
        }
        // the 'quadrant' is important, because it affects how we manipulate the x2,y2 values if a collision occurs
        if (this.angle < 90) {
            this.quadrant = 1;
        } else if (this.angle < 180) {
            this.quadrant = 2;
        } else if (this.angle < 270) {
            this.quadrant = 3;
        } else {
            this.quadrant = 4;
        }
    }

    drawLine() {

        /* ////////////////////////////////////////////////////////////////
        Before we draw the line, we need to check for collisions in the global 'coordArray'
        If collisions are detected, then the x2,y2 values are updated to reflect a 'non-colliding' path
        //////////////////////////////////////////////////////////////// */

        // Math.cos/Math.sin expects radians not degrees, so we need to convert input degrees to radians
        this.lineAngleRad = this.angle * Math.PI / 180;

        // calculates x2,y2 positions from x1,y1,angle and length
        this.x2 = round((this.x1 + (Math.cos(this.lineAngleRad) * this.length)), resolution);
        this.y2 = round((this.y1 - (Math.sin(this.lineAngleRad) * this.length)), resolution);

        /// stores the proposed coordinates & rounds to the resolution
        let x2y2Coords =
        {
            x: round(this.x2, resolution),
            y: round(this.y2, resolution)
        };

        // declare the occupiedArray for the proposed coordinates
        let proposedOccupiedArray = [];

        // work through to calculate possible coordinates the line will pass through based on the current length/x2,y2 values
        for (let i = 1; i < this.length; i += resolution) {
            let propGridCoordsXposYpos =
            {
                // our x value is adjacent the angle, so we multiply by cos(θ) to get its length, and then add that to the x1 val to get the coord
                x: ceil((this.x1 + (Math.cos(this.lineAngleRad) * i)), resolution),
                // our y value is opposite the angle, so we multiply by sin(θ) to get its length, and then add that to the y1 val to get the coord
                y: ceil((this.y1 - (Math.sin(this.lineAngleRad) * i)), resolution)
            }
            let propGridCoordsXposYneg =
            {
                // our x value is adjacent the angle, so we multiply by cos(θ) to get its length, and then add that to the x1 val to get the coord
                x: ceil((this.x1 + (Math.cos(this.lineAngleRad) * i)), resolution),
                // our y value is opposite the angle, so we multiply by sin(θ) to get its length, and then add that to the y1 val to get the coord
                y: floor((this.y1 - (Math.sin(this.lineAngleRad) * i)), resolution)
            }
            let propGridCoordsXNegYPos =
            {
                // our x value is adjacent the angle, so we multiply by cos(θ) to get its length, and then add that to the x1 val to get the coord
                x: floor((this.x1 + (Math.cos(this.lineAngleRad) * i)), resolution),
                // our y value is opposite the angle, so we multiply by sin(θ) to get its length, and then add that to the y1 val to get the coord
                y: ceil((this.y1 - (Math.sin(this.lineAngleRad) * i)), resolution)
            }
            let propGridCoordsXNegYNeg =
            {
                // our x value is adjacent the angle, so we multiply by cos(θ) to get its length, and then add that to the x1 val to get the coord
                x: floor((this.x1 + (Math.cos(this.lineAngleRad) * i)), resolution),
                // our y value is opposite the angle, so we multiply by sin(θ) to get its length, and then add that to the y1 val to get the coord
                y: floor((this.y1 - (Math.sin(this.lineAngleRad) * i)), resolution)
            }
            // update the occupied array with the potentially occupied coordinates
            proposedOccupiedArray.push(propGridCoordsXposYpos, propGridCoordsXposYneg, propGridCoordsXNegYPos, propGridCoordsXNegYNeg);
        }
        // push the proposeCoords into proposedOccupiedArray - but we want this at the end of the array
        proposedOccupiedArray.push(x2y2Coords);

        // cycles through the proposedOccupiedArray
        let matchedCoords;
        for (let i = 0; i < proposedOccupiedArray.length; i++) {
            // cycles through the global coordArray for each loop of the proposedOccupiedArray
            for (let j = 0; j < coordArray.length; j++) {
                // if both the x and y properties of the objects in the arrays match, it returns 'true'
                if (proposedOccupiedArray[i].x === coordArray[j].x && proposedOccupiedArray[i].y === coordArray[j].y) {
                    // if we get a match, then x2,y2 are updated to avoid collision
                    // length is updated to use in later calculation
                    // and the x2y2Coords object is updated to be used later
                    // if we don't get a match, then x2,y2 and length remain unchanged
                    // math applied to the coords depends on quadrant...
                    matchedCoords = true;
                    switch (this.quadrant) {
                        case 1:
                            // quadrant 1
                            this.x2 = proposedOccupiedArray[i].x - resolution;
                            this.y2 = proposedOccupiedArray[i].y + resolution;
                            break;
                        case 2:
                            // quadrant 2
                            this.x2 = proposedOccupiedArray[i].x + resolution;
                            this.y2 = proposedOccupiedArray[i].y + resolution;
                            break;
                        case 3:
                            // quadrant 3
                            this.x2 = proposedOccupiedArray[i].x + resolution;
                            this.y2 = proposedOccupiedArray[i].y - resolution;
                            break;
                        case 4:
                            // quadrant 4
                            this.x2 = proposedOccupiedArray[i].x - resolution;
                            this.y2 = proposedOccupiedArray[i].y - resolution;
                            break;
                    }

                    this.length = Math.sqrt(((this.x2 - this.x1) ** 2) + ((this.y2 - this.y1) ** 2));
                    x2y2Coords['x'] = this.x2;
                    x2y2Coords['y'] = this.y2;

                    // // uncomment this if you want to track the collision points
                    // makeCircle(proposedOccupiedArray[i].x, proposedOccupiedArray[i].y);
                }
            }
            if (matchedCoords === true) {
                break;
            }
        }
        /* ////////////////////////////////////////////////////////////////
        We now need to update the global array with the adjusted coordinates so
        it reflects the current paths ?????? (not sure about how this functions 
            with lines that will be drawn at the same time...)
        //////////////////////////////////////////////////////////////// */

        // work through to calculate actual coordinates the line will pass through based on the current length/x2,y2 values
        for (let i = 1; i < this.length; i += resolution) {
            let gridCoordsXposYpos =
            {
                // our x value is adjacent the angle, so we multiply by cos(θ) to get its length, and then add that to the x1 val to get the coord
                x: ceil((this.x1 + (Math.cos(this.lineAngleRad) * i)), resolution),
                // our y value is opposite the angle, so we multiply by sin(θ) to get its length, and then add that to the y1 val to get the coord
                y: ceil((this.y1 - (Math.sin(this.lineAngleRad) * i)), resolution)
            }
            let gridCoordsXposYneg =
            {
                // our x value is adjacent the angle, so we multiply by cos(θ) to get its length, and then add that to the x1 val to get the coord
                x: ceil((this.x1 + (Math.cos(this.lineAngleRad) * i)), resolution),
                // our y value is opposite the angle, so we multiply by sin(θ) to get its length, and then add that to the y1 val to get the coord
                y: floor((this.y1 - (Math.sin(this.lineAngleRad) * i)), resolution)
            }
            let gridCoordsXnegYpos =
            {
                // our x value is adjacent the angle, so we multiply by cos(θ) to get its length, and then add that to the x1 val to get the coord
                x: floor((this.x1 + (Math.cos(this.lineAngleRad) * i)), resolution),
                // our y value is opposite the angle, so we multiply by sin(θ) to get its length, and then add that to the y1 val to get the coord
                y: ceil((this.y1 - (Math.sin(this.lineAngleRad) * i)), resolution)
            }
            let gridCoordsXnegYneg =
            {
                // our x value is adjacent the angle, so we multiply by cos(θ) to get its length, and then add that to the x1 val to get the coord
                x: floor((this.x1 + (Math.cos(this.lineAngleRad) * i)), resolution),
                // our y value is opposite the angle, so we multiply by sin(θ) to get its length, and then add that to the y1 val to get the coord
                y: floor((this.y1 - (Math.sin(this.lineAngleRad) * i)), resolution)
            }
            // update the occupied array with the potentially occupied coordinates
            coordArray.push(gridCoordsXposYpos, gridCoordsXposYneg, gridCoordsXnegYpos, gridCoordsXnegYneg);
        }

        // also push the actual x2,y2 coords into the end of the array
        coordArray.push(x2y2Coords);


        /* ////////////////////////////////////////////////////////////////
        Only now can we can actually draw the line
        //////////////////////////////////////////////////////////////// */


        // call the line function with the correct coordinates
        this.svgElement = line(this.x1, this.y1, this.x2, this.y2, this.id);
        // append the svg with the drawn line
        // using [0] as we are also passing other data out of the line function
        svg.appendChild(this.svgElement[0]);
        // call the 'addAnimation' method
        this.addAnimation();
    }

    addAnimation() {
        //adds the animation to the x2,y2 properties of the line

        // animation for the x2 coordinates of the line
        let animElementX2 = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animElementX2.setAttribute('attributeName', 'x2');
        animElementX2.setAttribute('from', this.x1);
        animElementX2.setAttribute('to', this.x2);
        // fill freeze stops the line from continuously animating
        animElementX2.setAttribute('fill', 'freeze');

        // is 0 sufficient here? or does it need to be offset somehow?
        animElementX2.setAttribute('begin', '0');
        // should duration be set, or randomised?
        animElementX2.setAttribute('dur', this.animDur);

        let animElementY2 = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        // animation for the y2 coordinates of the line
        animElementY2.setAttribute('attributeName', 'y2');
        animElementY2.setAttribute('from', this.y1);
        animElementY2.setAttribute('to', this.y2);
        // fill freeze stops the line from continuously animating
        animElementY2.setAttribute('fill', 'freeze');

        // is 0 sufficient here? or does it need to be offset somehow?
        animElementY2.setAttribute('begin', '0');
        // should duration be set, or randomised?
        animElementY2.setAttribute('dur', this.animDur);

        this.svgElement[0].appendChild(animElementX2);
        this.svgElement[0].appendChild(animElementY2);
    }
}