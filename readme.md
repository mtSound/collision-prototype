A prototype 'agent-based' system for drawing straight lines
If a line will collide with another line, the x2,y2 coordinates are altered to stop the line before collision

Recursion is also called within the 'Line' class.
* Once a collision is encountered, the 'createChild' method is invoked
* This method draws new lines from defined points on the initial line, and at defined angles
* Once these lines collide with something, the 'createChild' method is recursively called
* recursion is aborted once the length of a line is =< 20


Notes:

* Currently only works for straight lines (underlying math is based on complementary right angle triangles)
** I think I can expand to work for strictly circular arcs (non-standard arcs would be extraordinarily complicated though...)

** If required I can amend this to just store & calculate coordinates, instead of actually appending SVG objects






TO IMPLEMENT:

drawing animation
'remove child' animation - after a fixed amount of time?
--- how would this work with children? should they be removed first, or last?

arc paths?

easier definition of rulesets?

- change colour or opacity or stroke width for children?

