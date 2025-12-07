Components of the rendering space:
1. Geometries/Entities(Mathematical Basis): Lines, Polylines, Planes, Meshes
2. Scene: Collection of entities which can be transformed
3. Tools: Used to modify entities
5. Camera/Viewpoints
6. Rendering: Takes the Scene and Viewpoint into account to create the final image

In the structuring of my workspace, I thought it would be best to separate classes generally according to these components, so for example you will find a camera.js file where I include the code accounting for the "view" space, and then a tool.js file where I include tools such as the line creation tool.

I started my process by researching the mathematical foundation of rendering spaces. My main goal in this project is to be able to understand the systems behind the rendering programs such as Rhino3D, Revit, or AutoCAD so that I could practice them with more intention and recognize issues I often run into (such as confusing surfaces and solids) by understanding the vector space creating these objects. The pinnacle behind rendering softwares is the concept of raycasting, which produces the output of a "clip," which is like a screenshot, to show the user a specific view of the workspace taking into account the relationships between objects, and their relationship to the entire space. I decided on raycasting as opposed to raytracing (w to account for space and time restrictions, but if I had had more time to implement lighting and shading I would've used raytracing, which computes reflections off of an object in addition to the position (sampled by the ray).

Raycasting Equation: P x V x M x position
  where:
    position = coordinate (x, y, z)
    M = Model Matrix: multiplied by the position coordinate (which is in the object space) transforms this coordinate into the world space
    P = Projection Matrix: multiplied by the world space coordinate (position x M) transforms this coordinate into the "view"/camera space
    V = View Matrix: multiplied by the view space coordinate (position x M x P) transforms this coordinate into the clip space

Line Tool:

Rotational Tool:
  Yaw:
  Pitch:
  Roll:
