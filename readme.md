Researched 'ray marching' as a loose concept for looking for collisions

We start with an empty 'coordArray', which will eventually be an array full of occupied coordinates

The 'Line' class in the utils then script does the following:

1. Takes a start point (x1, y1), angle in degrees (basically what direction it shoots off in), and a length
2. Calculates the proposed end-point of the line (x2, y2) based on the input
3. Calculates the coordinates that the line would pass through based on the proposed end-point
4. It compares these coordinates with those stored in the 'coordArray'
5. If a match is found, the x2,y2 coordinates are altered to avoid a collision - this becomes the ACTUAL x2,y2 position for the line
6. Once the actual 'collision-free' line has been calculated, it adds the coordinates that that line would pass through into the 'coordArray (so new lines can check for collisions against this line)
7. Then the line is drawn
8. Animation currently is simple x2,y2 animation



* Not sure how this would go with anything that isn't a line...
* Not sure how this could be applied to HTML canvas