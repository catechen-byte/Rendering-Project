// Export a 3D vector class
export class Vector3 {
  constructor(x = 0, y = 0, z = 0) { // Initializing
    this.x = x; // Store x 
    this.y = y; // Store y 
    this.z = z; // Store z 
  }

  clone() { // Return a copy of this vector
    return new Vector3(this.x, this.y, this.z); // New Vector3 with same components
  }

  add(v) { // Add another vector v to this vector
    this.x += v.x; // Add x 
    this.y += v.y; // Add y
    this.z += v.z; // Add z
    return this; // Return this for chaining
  }

  subtract(v) { // Subtract another vector v from our vector
    this.x -= v.x; // Subtract x 
    this.y -= v.y; // Subtract y 
    this.z -= v.z; // Subtract z
    return this; // Return this for chaining
  }

  scale(s) { // Scale this vector by scalar s
    this.x *= s; // Scale x
    this.y *= s; // Scale y
    this.z *= s; // Scale z
    return this; // Return this for chaining
  }
}
