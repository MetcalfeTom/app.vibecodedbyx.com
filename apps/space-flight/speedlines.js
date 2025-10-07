// Camera-attached speed lines overlay for SpaceCraft
import * as THREE from 'three';

let SPEEDLINES_COUNT = 700;
let SPEEDLINES_NEAR_Z = -0.6;
let SPEEDLINES_FAR_Z = -24;
let SPEEDLINES_SPREAD_X = 5.0;
let SPEEDLINES_SPREAD_Y = 3.5;

let slGeom, slMat, slPositions, slStartsX, slStartsY, slZ;

function seedSpeedLine(i) {
  slStartsX[i] = (Math.random() - 0.5) * SPEEDLINES_SPREAD_X * 2;
  slStartsY[i] = (Math.random() - 0.5) * SPEEDLINES_SPREAD_Y * 2;
  slZ[i] = SPEEDLINES_FAR_Z + Math.random() * (SPEEDLINES_FAR_Z - SPEEDLINES_NEAR_Z);
}

export function initSpeedLines(camera, opts = {}) {
  SPEEDLINES_COUNT = opts.count ?? SPEEDLINES_COUNT;
  SPEEDLINES_NEAR_Z = opts.nearZ ?? SPEEDLINES_NEAR_Z;
  SPEEDLINES_FAR_Z = opts.farZ ?? SPEEDLINES_FAR_Z;
  SPEEDLINES_SPREAD_X = opts.spreadX ?? SPEEDLINES_SPREAD_X;
  SPEEDLINES_SPREAD_Y = opts.spreadY ?? SPEEDLINES_SPREAD_Y;

  slGeom = new THREE.BufferGeometry();
  slPositions = new Float32Array(SPEEDLINES_COUNT * 2 * 3); // line segments: 2 verts each
  slStartsX = new Float32Array(SPEEDLINES_COUNT);
  slStartsY = new Float32Array(SPEEDLINES_COUNT);
  slZ = new Float32Array(SPEEDLINES_COUNT);

  for (let i = 0; i < SPEEDLINES_COUNT; i++) seedSpeedLine(i);
  slGeom.setAttribute('position', new THREE.Float32BufferAttribute(slPositions, 3));
  slMat = new THREE.LineBasicMaterial({ color: 0x88ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false });
  const speedLines = new THREE.LineSegments(slGeom, slMat);
  speedLines.renderOrder = 9999; // draw on top
  camera.add(speedLines);
}

export function updateSpeedLines(speedScalarNow, denom) {
  if (!slGeom || !slMat) return;
  const sf = Math.min(1, speedScalarNow / Math.max(denom || 1, 1));
  const advanceBase = 0.10;          // base movement per frame (camera space)
  const advanceScale = 0.90;         // additional movement with speed
  const lenBase = 0.6;               // base line length
  const lenScale = 8.0;              // extra length with speed
  let p = 0;
  for (let i = 0; i < SPEEDLINES_COUNT; i++) {
    const adv = advanceBase + sf * advanceScale;
    slZ[i] += adv; // move toward camera (increasing toward 0)
    if (slZ[i] > SPEEDLINES_NEAR_Z) {
      // reset far with new x/y
      slZ[i] = SPEEDLINES_FAR_Z;
      slStartsX[i] = (Math.random() - 0.5) * SPEEDLINES_SPREAD_X * 2;
      slStartsY[i] = (Math.random() - 0.5) * SPEEDLINES_SPREAD_Y * 2;
    }
    const x = slStartsX[i];
    const y = slStartsY[i];
    const zHead = slZ[i];
    const length = lenBase + sf * lenScale;
    const zTail = zHead - length; // stretch backward along -Z
    // head
    slPositions[p++] = x; slPositions[p++] = y; slPositions[p++] = zHead;
    // tail
    slPositions[p++] = x; slPositions[p++] = y; slPositions[p++] = zTail;
  }
  slGeom.attributes.position.needsUpdate = true;
  slMat.opacity = 0.10 + sf * 0.65; // fade in with speed
}

