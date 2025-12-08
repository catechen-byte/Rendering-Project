import { LineEntity } from './scene.js';
import { Vector3 } from './math.js';

// Making a local dot for our plane intersection
function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function intersectRayPlane(origin, dir, planeNormal, planePoint) {
  const denom = dot(planeNormal, dir);
  if (Math.abs(denom) < 1e-6) return null;

  const diff = new Vector3(
    planePoint.x - origin.x,
    planePoint.y - origin.y,
    planePoint.z - origin.z
  );

  const t = dot(planeNormal, diff) / denom;
  return new Vector3(
    origin.x + dir.x * t,
    origin.y + dir.y * t,
    origin.z + dir.z * t
  );
}

// Line tool that is awre of multiple viewports
export class LineTool {
  constructor(scene, canvas, viewports) {
    this.scene = scene;
    this.canvas = canvas;
    this.viewports = viewports; // Array of {x,y,width,height,camera,grid,name}

    this.isDrawing = false;
    this.startPointWorld = null;
    this.currentPointWorld = null;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    canvas.addEventListener('mousedown', this.onMouseDown);
    canvas.addEventListener('mousemove', this.onMouseMove);
    canvas.addEventListener('mouseup', this.onMouseUp);
  }

  getMousePos(evt) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  _findViewport(mouse) {
    for (const vp of this.viewports) {
      if (
        mouse.x >= vp.x &&
        mouse.x < vp.x + vp.width &&
        mouse.y >= vp.y &&
        mouse.y < vp.y + vp.height
      ) {
        return vp;
      }
    }
    return null;
  }

  // Taking a screen event and translating it to world point snapped to that viewport's grid
  _mouseToSnappedWorld(evt) {
    const mouse = this.getMousePos(evt);
    const vp = this._findViewport(mouse);
    if (!vp || !vp.grid) return null;

    const localX = mouse.x - vp.x;
    const localY = mouse.y - vp.y;

    const { origin, dir } = vp.camera.screenRay(
      localX,
      localY,
      vp.width,
      vp.height
    );

    const planeNormal = vp.grid.planeNormal;
    const planePoint = vp.grid.planePoint;

    const hit = intersectRayPlane(origin, dir, planeNormal, planePoint);
    if (!hit) return null;

    const snapped = vp.grid.snap(hit);
    return { viewport: vp, point: snapped };
  }

  // Clincking cursor down
  onMouseDown(evt) {
    const res = this._mouseToSnappedWorld(evt);
    if (!res) return;
    const p = res.point;

    if (!this.isDrawing) {
      this.startPointWorld = p;
      this.currentPointWorld = p;
      this.isDrawing = true;
    } else {
      this.currentPointWorld = p;
      const line = new LineEntity(
        this.startPointWorld,
        this.currentPointWorld,
        '#000000'
      );
      this.scene.lines.push(line);
      this.isDrawing = false;
      this.startPointWorld = null;
      this.currentPointWorld = null;
    }
  }

  onMouseMove(evt) {
    if (!this.isDrawing) return;
    const res = this._mouseToSnappedWorld(evt);
    if (!res) return;
    this.currentPointWorld = res.point;
  }

  //Lifting cursor up (off)
  onMouseUp(evt) {
    // Nothing happens
  }

  // Drawing our preview line in a viewport
  drawOverlayInViewport(ctx, viewport) {
    if (!this.isDrawing || !this.startPointWorld || !this.currentPointWorld)
      return;

    const cam = viewport.camera;
    const w = viewport.width;
    const h = viewport.height;

    const s0 = cam.project(this.startPointWorld, w, h);
    const s1 = cam.project(this.currentPointWorld, w, h);

    ctx.save();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(s0.x, s0.y);
    ctx.lineTo(s1.x, s1.y);
    ctx.stroke();
    ctx.restore();
  }
}
