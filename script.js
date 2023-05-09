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



