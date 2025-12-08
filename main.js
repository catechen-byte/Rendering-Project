import { Vector3 } from './math.js';
import { AxisOrthoCamera, OrbitOrthoCamera } from './camera.js';
import { Scene } from './scene.js';
import { LineTool } from './tools.js';
import { PlaneGrid } from './grid.js';

const canvas = document.getElementById('view');
const ctx = canvas.getContext('2d');

// Global viewport list where each of our entries is updated on resize
const viewports = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  updateViewports();
}

// Scene
const scene = new Scene();

// Cameras
const target = new Vector3(0, 0, 0);
const topCamera = new AxisOrthoCamera(target, 20, 20, 'top');
const frontCamera = new AxisOrthoCamera(target, 20, 20, 'front');
const rightCamera = new AxisOrthoCamera(target, 20, 20, 'right');
const perspCamera = new OrbitOrthoCamera(
  target,
  20,
  20,
  20,
  Math.PI / 4,  // yaw
  Math.PI / 6   // pitch
);

// Grids
const gridXY = new PlaneGrid(1, 10, 'XY');
const gridXZ = new PlaneGrid(1, 10, 'XZ');
const gridYZ = new PlaneGrid(1, 10, 'YZ');

// Set up viewport rectangles and link cameras and grids
function updateViewports() {
  viewports.length = 0;
  const halfW = canvas.width / 2;
  const halfH = canvas.height / 2;

  viewports.push(
    {
      name: 'Top',
      x: 0,
      y: 0,
      width: halfW,
      height: halfH,
      camera: topCamera,
      grid: gridXY
    },
    {
      name: 'Front',
      x: halfW,
      y: 0,
      width: halfW,
      height: halfH,
      camera: frontCamera,
      grid: gridXZ
    },
    {
      name: 'Right',
      x: 0,
      y: halfH,
      width: halfW,
      height: halfH,
      camera: rightCamera,
      grid: gridYZ
    },
    {
      name: 'Perspective',
      x: halfW,
      y: halfH,
      width: halfW,
      height: halfH,
      camera: perspCamera,
      grid: gridXY // use XY plane as construction plane
    }
  );
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Line tool aware of all viewports
const lineTool = new LineTool(scene, canvas, viewports);

// Orbiting and zooming in and out on the perspective camera
window.addEventListener('keydown', (evt) => {
  const rotStep = (5 * Math.PI) / 180; // 5 degrees
  const zoomIn = 0.9;
  const zoomOut = 1.1;

  switch (evt.key) {
    case 'q':
      perspCamera.rotateYawBy(rotStep);
      break;
    case 'e':
      perspCamera.rotateYawBy(-rotStep);
      break;
    case 'w':
      perspCamera.rotatePitchBy(rotStep);
      break;
    case 's':
      perspCamera.rotatePitchBy(-rotStep);
      break;
    case '+':
      topCamera.zoomBy(zoomIn);
      frontCamera.zoomBy(zoomIn);
      rightCamera.zoomBy(zoomIn);
      perspCamera.zoomBy(zoomIn);
      break;
    case '-':
      topCamera.zoomBy(zoomOut);
      frontCamera.zoomBy(zoomOut);
      rightCamera.zoomBy(zoomOut);
      perspCamera.zoomBy(zoomOut);
      break;
    default:
      break;
  }
});

// Draw world axis in viewports
function drawAxesInViewport(ctx, vp) {
  const cam = vp.camera;
  const w = vp.width;
  const h = vp.height;

  const origin = new Vector3(0, 0, 0);
  const xAxis = new Vector3(5, 0, 0);
  const yAxis = new Vector3(0, 5, 0);
  const zAxis = new Vector3(0, 0, 5);

  const o = cam.project(origin, w, h);
  const sx = cam.project(xAxis, w, h);
  const sy = cam.project(yAxis, w, h);
  const sz = cam.project(zAxis, w, h);

  ctx.save();
  ctx.lineWidth = 2;

  ctx.strokeStyle = '#ff0000';
  ctx.beginPath();
  ctx.moveTo(o.x, o.y);
  ctx.lineTo(sx.x, sx.y);
  ctx.stroke();

  ctx.strokeStyle = '#00aa00';
  ctx.beginPath();
  ctx.moveTo(o.x, o.y);
  ctx.lineTo(sy.x, sy.y);
  ctx.stroke();

  ctx.strokeStyle = '#0000ff';
  ctx.beginPath();
  ctx.moveTo(o.x, o.y);
  ctx.lineTo(sz.x, sz.y);
  ctx.stroke();
  ctx.restore();
}

// Draw scene lines in a viewport
function drawLinesInViewport(ctx, vp) {
  const cam = vp.camera;
  const w = vp.width;
  const h = vp.height;
  ctx.save();
  ctx.setLineDash([]);
  ctx.lineWidth = 2;

  for (const line of scene.lines) {
    const s0 = cam.project(line.start, w, h);
    const s1 = cam.project(line.end, w, h);
    ctx.strokeStyle = line.color;
    ctx.beginPath();
    ctx.moveTo(s0.x, s0.y);
    ctx.lineTo(s1.x, s1.y);
    ctx.stroke();
  }
  ctx.restore();
}

// Main render loop
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const vp of viewports) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(vp.x, vp.y, vp.width, vp.height);
    ctx.clip();
    ctx.translate(vp.x, vp.y);
    ctx.fillStyle = '#efe8e8ff';
    ctx.fillRect(0, 0, vp.width, vp.height);
    if (vp.grid) {
      vp.grid.draw(ctx, vp.camera, vp.width, vp.height);
    }

    drawAxesInViewport(ctx, vp);
    drawLinesInViewport(ctx, vp);
    lineTool.drawOverlayInViewport(ctx, vp);
    ctx.fillStyle = '#000000';
    ctx.font = '12px sans-serif';
    ctx.fillText(vp.name, 6, 14);
    ctx.restore();
  }
  requestAnimationFrame(render);
}
render();
