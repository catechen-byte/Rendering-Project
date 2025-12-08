// Export a 3D line entity
export class LineEntity {
  // start and end are Vector3, color is CSS string
  constructor(start, end, color) { 
    this.start = start; // Store start point in world coordinates
    this.end = end;     // Store end point in world coordinates
    this.color = color; // Store line color
  }
}

// Export our scene container
export class Scene {
  constructor() {
    this.lines = []; // Storing our array of LineEntity objects
  }
}
