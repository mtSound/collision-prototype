/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LINE CLASS
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Line {
    // takes start position (x1, y1), the angle (direction to draw the line in), and the stroke width (to scale down on recursion)
    constructor(x1, y1, angle, stroke) {
        // rounds the (x1, y1) position to the resolution (it's easier to work with whole numbers - floating numbers increase overhead)
        this.x1 = round(x1, resolution);
        this.y1 = round(y1, resolution);
        this.stroke = stroke;

        // Math.cos(90)/Math.sin(90) (or any multiple of 90) will return a 0 and the line won't propagate
        // this is a simple switch case that checks if the input angle is a multiple of 90, and then adjusts so
        // the line will actually draw
        switch (angle % 90) {
            case 0:
                this.angle = angle + 1;
                break;
            default:
                this.angle = angle;
        }

        // convert the angle to radians (Math.cos and Math.sin expect radians, not degrees)
        this.lineAngleRad = this.angle * Math.PI / 180;
        
        // declare the length of the line, but calculate it later (after we have our (x2, y2) positions)
        this.length;

        // define an empty array to store the coordinates of this line in so that 'child' lines can be recursively
        // drawn from the 'parent' line
        this.childArray = [];
        this.svgElement;

        //this.animDur = randNumLim(2, 10);
        this.id = ("line_" + document.getElementsByTagName('line').length);
    }

    drawLine() {
        
        let lengthLim = Math.max(width,height) * 2;

        // calculate initial x2,y2 coordinates, imagining that the length of the line will be twice the width of the canvas
        // basically, start off with a really long line
        this.x2 = round((this.x1 + (Math.cos(this.lineAngleRad) * lengthLim)), resolution);
        this.y2 = round((this.y1 - (Math.sin(this.lineAngleRad) * lengthLim)), resolution);

        // set 'matchedCoords' to false before we evaluate the 'arrContainsObject' in the below for loop
        let matchedCoords = false;
        // declare an empty array to store the line coordinates in
        let tempArray = [];
        
        // this for loop increases the length of the line on each loop until a matched coordinate is encountered
        // 'i' needs to be greater than the resolution, otherwise a match will immediately be encountered
        for (let i = 5; i < lengthLim; i += resolution) {
            // calculate the (x2,y2) coordinates for the line for each iteration of the loop
            // i.e. on the first loop, the length of the line = 5, then increasing by the resolution until a match is encountered
            let x2y2 =
            {
                x: round((this.x1 + (Math.cos(this.lineAngleRad) * i)), resolution),
                y: round((this.y1 - (Math.sin(this.lineAngleRad) * i)), resolution)
            }
            // this is where we evaluate if the current (x2,y2) coordinates are already present in the global 'coordArray'
            if (arrContainsObject(x2y2, coordArray) === true) {
                matchedCoords = true;
                // if we get a match, update the end point of the line to the current coordinates
                this.x2 = x2y2.x;
                this.y2 = x2y2.y;
                // push these coordinates into the tempArray
                tempArray.push(x2y2);

                let idX2Y2 = {
                    id: this.id,
                    x: this.x2,
                    y: this.y2,
                }
                collisionArray.push(idX2Y2);
                // break the loop once a match is encountered
                break;
            } else {
                // if no match is encountered, push the final coordinates from the end of the loop into the tempArray
                tempArray.push(x2y2);
            }
        }

        // store the start coordinates of the line (x1, y1) to be pushed into the gloabl 'coordArray'
        let x1y1Coords = {
            x: this.x1,
            y: this.y1
        }

        // calculate the length of the line based on the calculated (x2, y2) coordinates (to use for the 'child' lines)
        this.length = Math.sqrt(((this.x2 - this.x1) ** 2) + ((this.y2 - this.y1) ** 2));
        // push the line coordinates (tempArray) into the 'childArray' so subsequent lines can be generated from the parent
        this.childArray.push(...tempArray);
        // push the line coordinates (tempArray) into the global 'coordArray'
        coordArray.push(...tempArray);
        // also push coordinates of the line's beginning and end into the global 'coordArray'
        coordArray.push(x1y1Coords); //, x2y2Coords);


        // call the line function with the correct coordinates
        this.svgElement = line(this.x1, this.y1, this.x2, this.y2, this.stroke, this.id);
        // add the line to the canvas
        svg.appendChild(this.svgElement);
        //// add animation
        //this.addAnimation();

        // if the line collided with another line (ie. 'matchedCoords === true'), AND the length of the line is greater than 20
        // then create a 'child' line. THIS STOPS THE RECURSION
        // the length can be shortened, but the continued recursion increases overhead
        if (matchedCoords) {
            if (this.length > 20) {
                this.createChild();
            }
        }
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
        // animElementX2.setAttribute('begin', this.startAnim);
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
        // animElementY2.setAttribute('begin', this.startAnim);
        // should duration be set, or randomised?
        animElementY2.setAttribute('dur', this.animDur);

        this.svgElement.appendChild(animElementX2);
        this.svgElement.appendChild(animElementY2);
    }

    createChild() {
        /* THESE RULES CAN BE BLAYED WITH */
        // random angles and positions seem to generate 'spider-web' patterns
        
        // rule for scaling the stroke-width down with each iteration of recursion:
        let childStroke = this.stroke * 0.9;

        // rule for what angle the 'child' will shoot off in
        // change the offset value or symbol (+/-), or call the random function instead
        let childAng = this.angle - 30;
        let childAngRand = randNumLim(0,360);
        
        // rules for how at what position along the parent line the child should spawn from
        let qrtrLength = this.length*0.25;
        let halfLength = this.length*0.5;
        let thrQrtrLength = this.length*0.75;
        // // pick a starting position halfway along the line
        let childXY1 = {
            x: (this.x1 + (Math.cos(this.lineAngleRad) * (halfLength))),
            y: (this.y1 - (Math.sin(this.lineAngleRad) * (halfLength)))
        };
        // // pick a starting position a quarter of the way along the line
        let childXY2 = {
            x: (this.x1 + (Math.cos(this.lineAngleRad) * (qrtrLength))),
            y: (this.y1 - (Math.sin(this.lineAngleRad) * (qrtrLength)))
        };
        // // pick a starting position three quarters of the way along the line
        let childXY3 = {
            x: (this.x1 + (Math.cos(this.lineAngleRad) * (thrQrtrLength))),
            y: (this.y1 - (Math.sin(this.lineAngleRad) * (thrQrtrLength)))
        };

        // OR, if you'd like to pick a random coord from the parent array, use this:
        let childXYrand = this.childArray[Math.floor(Math.random() * this.childArray.length)];
        
        // simply define new children for each parent using one of the above methods
        // ensure you use .x .y to address the x & y values separately
        let child1 = new Line(childXYrand.x, childXYrand.y, childAngRand, childStroke);
        let child2 = new Line(childXY2.x, childXY2.y, childAng, childStroke);
        let child3 = new Line(childXY3.x, childXY3.y, childAng, childStroke);

        // then call as many children for each collision as you'd like
        child1.drawLine();
        child2.drawLine();
        child3.drawLine();

    }
}