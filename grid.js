import { Vector3 } from './math.js';

// Creating a grid on a coordinate plane with snapping
export class PlaneGrid {
  // plane type: 'xy' or 'xz' or 'yz'
  constructor(spacing = 1, halfExtent = 10, planeType = 'XY') {
    this.spacing = spacing;
    this.halfExtent = halfExtent;
    this.planeType = planeType;

    if (planeType === 'XY') {
      this.planeNormal = new Vector3(0, 0, 1); // z = 0
      this.planePoint = new Vector3(0, 0, 0);
    } else if (planeType === 'XZ') {
      this.planeNormal = new Vector3(0, 1, 0); // y = 0
      this.planePoint = new Vector3(0, 0, 0);
    } else if (planeType === 'YZ') {
      this.planeNormal = new Vector3(1, 0, 0); // x = 0
      this.planePoint = new Vector3(0, 0, 0);
    }
  }

  // Snap a world point to nearest grid point on our plane
  snap(p) {
    const s = this.spacing;
    if (this.planeType === 'XY') {
      const x = Math.round(p.x / s) * s;
      const y = Math.round(p.y / s) * s;
      return new Vector3(x, y, 0);
    } else if (this.planeType === 'XZ') {
      const x = Math.round(p.x / s) * s;
      const z = Math.round(p.z / s) * s;
      return new Vector3(x, 0, z);
    } else {
      // YZ
      const y = Math.round(p.y / s) * s;
      const z = Math.round(p.z / s) * s;
      return new Vector3(0, y, z);
    }
  }

  // Drawing grid lines using camera
  draw(ctx, camera, viewportWidth, viewportHeight) {
    const step = this.spacing;
    const max = this.halfExtent;

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#c6c6c6ff';
    ctx.setLineDash([]);

    if (this.planeType === 'XY') {
      // Vertical lines
      for (let x = -max; x <= max; x += step) {
        const p0 = new Vector3(x, -max, 0);
        const p1 = new Vector3(x,  max, 0);
        const s0 = camera.project(p0, viewportWidth, viewportHeight);
        const s1 = camera.project(p1, viewportWidth, viewportHeight);
        ctx.beginPath();
        ctx.moveTo(s0.x, s0.y);
        ctx.lineTo(s1.x, s1.y);
        ctx.stroke();
      }
      // Horizontal lines
      for (let y = -max; y <= max; y += step) {
        const p0 = new Vector3(-max, y, 0);
        const p1 = new Vector3( max, y, 0);
        const s0 = camera.project(p0, viewportWidth, viewportHeight);
        const s1 = camera.project(p1, viewportWidth, viewportHeight);
        ctx.beginPath();
        ctx.moveTo(s0.x, s0.y);
        ctx.lineTo(s1.x, s1.y);
        ctx.stroke();
      }
    } else if (this.planeType === 'XZ') {
      for (let x = -max; x <= max; x += step) {
        const p0 = new Vector3(x, 0, -max);
        const p1 = new Vector3(x, 0,  max);
        const s0 = camera.project(p0, viewportWidth, viewportHeight);
        const s1 = camera.project(p1, viewportWidth, viewportHeight);
        ctx.beginPath();
        ctx.moveTo(s0.x, s0.y);
        ctx.lineTo(s1.x, s1.y);
        ctx.stroke();
      }
      for (let z = -max; z <= max; z += step) {
        const p0 = new Vector3(-max, 0, z);
        const p1 = new Vector3( max, 0, z);
        const s0 = camera.project(p0, viewportWidth, viewportHeight);
        const s1 = camera.project(p1, viewportWidth, viewportHeight);
        ctx.beginPath();
        ctx.moveTo(s0.x, s0.y);
        ctx.lineTo(s1.x, s1.y);
        ctx.stroke();
      }
    } else {
      // YZ
      for (let y = -max; y <= max; y += step) {
        const p0 = new Vector3(0, y, -max);
        const p1 = new Vector3(0, y,  max);
        const s0 = camera.project(p0, viewportWidth, viewportHeight);
        const s1 = camera.project(p1, viewportWidth, viewportHeight);
        ctx.beginPath();
        ctx.moveTo(s0.x, s0.y);
        ctx.lineTo(s1.x, s1.y);
        ctx.stroke();
      }
      for (let z = -max; z <= max; z += step) {
        const p0 = new Vector3(0, -max, z);
        const p1 = new Vector3(0,  max, z);
        const s0 = camera.project(p0, viewportWidth, viewportHeight);
        const s1 = camera.project(p1, viewportWidth, viewportHeight);
        ctx.beginPath();
        ctx.moveTo(s0.x, s0.y);
        ctx.lineTo(s1.x, s1.y);
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}
