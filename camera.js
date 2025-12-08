import { Vector3 } from './math.js';

function normalize(v) {
  const len = Math.hypot(v.x, v.y, v.z);
  if (len === 0) return new Vector3(0, 0, 0);
  return new Vector3(v.x / len, v.y / len, v.z / len);
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function cross(a, b) {
  return new Vector3(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x
  );
}

// Abstractinf our camera base

export class OrthoCameraBase {
  constructor(target, worldWidth, worldHeight) {
    // Point in world-space
    this.target = target;
    // Width in world units
    this.worldWidth = worldWidth;
    // Height in world units
    this.worldHeight = worldHeight;
  }

  //Projecting the world point and making it local on the screen as translated point
  project(point, viewportWidth, viewportHeight) {
    const { right, up } = this._getBasis();
    const halfW = this.worldWidth / 2;
    const halfH = this.worldHeight / 2;
    const rel = new Vector3(
      point.x - this.target.x,
      point.y - this.target.y,
      point.z - this.target.z
    );

    const cx = dot(rel, right);
    const cy = dot(rel, up);

    // Our normalized device coordinate is found by taking the clip matrix and dividing by the 4th parameter
    // This ensures that the point is variable but the vector "direction" is constant 
    const xNdc = cx / halfW;
    const yNdc = cy / halfH;

    const xScreen = (xNdc + 1) * 0.5 * viewportWidth;
    const yScreen = (1 - (yNdc + 1) * 0.5) * viewportHeight;

    return { x: xScreen, y: yScreen };
  }

  // Taking that screen point and translating it to ray in world space
  screenRay(xScreen, yScreen, viewportWidth, viewportHeight) {
    const { right, up, forward } = this._getBasis();

    const halfW = this.worldWidth / 2;
    const halfH = this.worldHeight / 2;

    const xNdc = (xScreen / viewportWidth) * 2 - 1;
    const yNdc = ((viewportHeight - yScreen) / viewportHeight) * 2 - 1;

    const cx = xNdc * halfW;
    const cy = yNdc * halfH;

    const origin = new Vector3(
      this.target.x + right.x * cx + up.x * cy,
      this.target.y + right.y * cx + up.y * cy,
      this.target.z + right.z * cx + up.z * cy
    );

    const dir = normalize(forward);

    return { origin, dir };
  }

  zoomBy(factor) {
    this.worldWidth *= factor;
    this.worldHeight *= factor;
  }
}

// Fixing the axis views: Top, Front, Right

export class AxisOrthoCamera extends OrthoCameraBase {
  constructor(target, worldWidth, worldHeight, orientation) {
    super(target, worldWidth, worldHeight);
    this.orientation = orientation; // 'top' | 'front' | 'right'
  }

  _getBasis() {
    // Define right, up, forward for each view
    switch (this.orientation) {
      case 'top': {
        const right = new Vector3(1, 0, 0);   // +x to right
        const up = new Vector3(0, 1, 0);      // +y up
        const forward = new Vector3(0, 0, -1); // looking down -z
        return { right, up, forward };
      }
      case 'front': {
        const right = new Vector3(1, 0, 0);   // +x to right
        const up = new Vector3(0, 0, 1);      // +z up
        const forward = new Vector3(0, -1, 0); // looking down -y
        return { right, up, forward };
      }
      case 'right': {
        const right = new Vector3(0, 1, 0);   // +y to right
        const up = new Vector3(0, 0, 1);      // +z up
        const forward = new Vector3(-1, 0, 0); // looking down -x
        return { right, up, forward };
      }
    }
  }
}

// Orbiting orthographic camera for the perspective viewport

export class OrbitOrthoCamera extends OrthoCameraBase {
  constructor(target, worldWidth, worldHeight, distance, yawRad = 0, pitchRad = 0) {
    super(target, worldWidth, worldHeight);
    this.distance = distance;
    this.yaw = yawRad;
    this.pitch = pitchRad;
    this.maxPitch = Math.PI / 2 - 0.05;
  }

  rotateYawBy(delta) {
    this.yaw += delta;
  }

  rotatePitchBy(delta) {
    this.pitch += delta;
    if (this.pitch > this.maxPitch) this.pitch = this.maxPitch;
    if (this.pitch < -this.maxPitch) this.pitch = -this.maxPitch;
  }

  _getBasis() {
    const cosP = Math.cos(this.pitch);
    const sinP = Math.sin(this.pitch);
    const cosY = Math.cos(this.yaw);
    const sinY = Math.sin(this.yaw);

    const pos = new Vector3(
      this.target.x + this.distance * cosP * cosY,
      this.target.y + this.distance * cosP * sinY,
      this.target.z + this.distance * sinP
    );

    let forward = new Vector3(
      this.target.x - pos.x,
      this.target.y - pos.y,
      this.target.z - pos.z
    );
    forward = normalize(forward);

    let worldUp = new Vector3(0, 0, 1);
    if (Math.abs(dot(forward, worldUp)) > 0.99) {
      worldUp = new Vector3(0, 1, 0);
    }

    let right = cross(forward, worldUp);
    right = normalize(right);

    let up = cross(right, forward);
    up = normalize(up);

    return { right, up, forward };
  }
}
