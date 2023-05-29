'use strict';

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CANVAS SETUP
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const svg = document.getElementById('base-svg');
let width = window.innerWidth;
let height = window.innerHeight;
svg.style.width = width;
svg.style.height = height;

// setting the button div as out of bounds for clicking
const btnDiv = document.querySelector('.transport');
let outOfBounds = btnDiv.offsetHeight;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BUTTON IMPLEMENTATION
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let resetBtn = document.getElementById('reset');
resetBtn.addEventListener('click', stopSeq);

let animateElem = document.querySelector('animate');


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SETUP
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// just in case we need a global 'resolution' for the 'grid'
let resolution = 1;
// blank array to store coordinates for all possible collision points
let coordArray = [];
// blank array to store ACTUAL collision points
let collisionArray = [];




// draw a line on mouse click
function logClick(e) {
  // get the x,y coordinates of the mouse click event
  let mouseX = parseInt(e.clientX);
  let mouseY = parseInt(e.clientY - outOfBounds);
  console.log(mouseX,mouseY);
  // as long as the mouse click didn't occure in the button div, then use these coordinates to draw a line
  if (mouseY > outOfBounds) {
    // depending on the quadrant the mouse was clicked in, set the angle so that the line heads towards the centre of the canvas
    let mouseAng = angDir(mouseX, mouseY);
    let line = new Line(mouseX, mouseY, mouseAng, resolution);
    line.drawLine();
  }
}

// event listener for clicking anywhere on the page
document.addEventListener('click', logClick);




