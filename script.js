'use strict';

// blank array to store coordinates to check
// the idea is that all possible coordinates will be pushed into the array when a line is drawn
// coordMatch will compare this array with the array for the line in question, and then proceed to an
// else statement if a match (collision) is detected
// I imagine for this to work we need to ensure that coordinates are always rounded, otherwise matching becomes
// very difficult
let coordArray = [];

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////// CANVAS SETUP
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const svg = document.getElementById("base-svg");
let width = window.innerWidth;
let height = window.innerHeight;
svg.style.width = width;
svg.style.height = height;



let lines = createLinesArray(400);


for (let line of lines) {
    line.drawLine();
  }





// /// testing with random nums
// /// quad 2 line projecting towards centre
// let startX = randNumLim(0, width/2);
// let startY = randNumLim(0, height/2);
// let startAngle = randNumLim(270, 360);
// let startLength =  randNumLim(100, width);
// let line1 = new Line(startX, startY, startAngle, startLength);

// line1.drawLine();

// /// quad 1 line projecting towards centre
// let startX2 = randNumLim(width/2, width);
// let startY2 = randNumLim(0, height/2);
// let startAngle2 = randNumLim(180, 270);
// let startLength2 = randNumLim(100, width);
// let line2 = new Line(startX2, startY2, startAngle2, startLength2);

// line2.drawLine();


// /// quad 4 line projecting towards centre
// let startX3 = randNumLim(width/2, width);
// let startY3 = randNumLim(height/2, height);
// let startAngle3 = randNumLim(90, 180);
// let startLength3 = randNumLim(100, width);
// let line3 = new Line(startX3, startY3, startAngle3, startLength3);

// line3.drawLine();

// // quad 3 line projecting towards centre
// let startX4 = randNumLim(0, width/2);
// let startY4 = randNumLim(height/2, height);
// let startAngle4 = randNumLim(0, 90);
// let startLength4 = randNumLim(0, width);
// let line4 = new Line(startX4, startY4, startAngle4, startLength4);

// line4.drawLine();

