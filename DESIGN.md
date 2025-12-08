Components of my rendering space:
1. Geometries/Entities(Mathematical Basis): Lines, Polylines, Planes, Meshes
2. Scene: Collection of entities which can be transformed
3. Tools: Used to modify entities
5. Camera/Viewpoints: The perspective you view from (think perception from user POV)
6. Rendering: Takes the Scene and Viewpoint into account to create the final image

In the structuring of my workspace, I thought it would be best to separate classes generally according to these components, so for example you will find a camera.js file where I include the code accounting for the "view" space, and then a tool.js file where I include tools such as the line creation tool.

I started my process by researching the mathematical foundation of rendering spaces. My main goal in this project is to be able to understand the systems behind the rendering programs such as Rhino3D, Revit, or AutoCAD so that I could practice them with more intention and recognize issues I often run into (such as confusing surfaces and solids) by understanding the vector space creating these objects. Understanding how to translate from the computer's coordinate system into a camera space and then into a "clip" space was essential to this program. The pinnacle behind rendering softwares is the concept of raycasting, which produces the output of a "clip," which is like a screenshot, to show the user a specific view of the workspace taking into account the relationships between objects, and their relationship to the entire space. I decided on raycasting as opposed to raytracing (w to account for space and time restrictions, but if I had had more time to implement lighting and shading I would've used raytracing, which computes reflections off of an object in addition to the position (sampled by the ray).

Raycasting Equation: P x V x M x position
  where:
    position = coordinate (x, y, z)
    M = Model Matrix: multiplied by the position coordinate (which is in the object space) transforms this coordinate into the world space
    P = Projection Matrix: multiplied by the world space coordinate (position x M) transforms this coordinate into the "view"/camera space
    V = View Matrix: multiplied by the view space coordinate (position x M x P) transforms this coordinate into the clip space
After getting your clip matrix with this equation, you can then find your normalized device coordinates (NDC) by dividing by the vector's 4th parameter. This is a concept from linear algebra that I researched into, where your coordinate will be transformed while your direction proportions are kept constant, to account for these transformations.

Line Tool: My line tool consists of three different event listeners: mouse down, mouse up, and mouse move. I knew I wanted there to be a hovering line while you were drawing, which is why I added the mouse move listener, so that you could see the projected line before committing. Mouse down commits a point, while mouse up does nothing so that you can know when to end the mouse down action.

Rotating: I learned about yaw, pitch, and roll, which are rotations around the x, y, and z axises. I chose a constant amount of degrees to rotate the camera view by as 5 degrees which felt functional when testing.

Zooming: I multiplied the camera view  by a 10% range, so 0.9 to zoom out, and 1.1 to zoom in.

Snapping: I realized that drawing in 3D required grids on each view in order to understand where your point is snapping to, on which plane space. For this reason I chose to replicate Rhino3D's viewports of Top, Front, Right, and Perspective. I had to create grids in each viewport with snaps attached.
