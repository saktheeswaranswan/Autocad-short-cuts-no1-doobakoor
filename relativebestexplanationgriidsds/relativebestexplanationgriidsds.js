let points = [];
let currentSegment = 0;
let t = 0;
const duration = 4000;
let lastMillis;
let path = [];
let originOffset;

function setup() {
  createCanvas(600, 600);
  originOffset = createVector(width / 2, height / 2);
  lastMillis = millis();

  // Maze path
  points = [
    createVector(-200, -200),
    createVector(200, -200),
    createVector(200, -100),
    createVector(-100, -100),
    createVector(-100, 100),
    createVector(150, 100),
    createVector(150, 200),
    createVector(-200, 200)
  ];
}

function draw() {
  background(255);

  // Time update
  let currentMillis = millis();
  let dt = currentMillis - lastMillis;
  lastMillis = currentMillis;

  let segmentDuration = duration / (points.length - 1);
  t += dt / segmentDuration;

  if (t >= 1) {
    t = 0;
    currentSegment = (currentSegment + 1) % (points.length - 1);
  }

  // Interpolate tracer position
  let p0 = points[currentSegment];
  let p1 = points[(currentSegment + 1) % points.length];
  let tracer = p5.Vector.lerp(p0, p1, t);
  let tracerScreen = tracer.copy().add(originOffset);
  path.push(tracerScreen.copy());

  // Draw full maze path
  stroke(0);
  noFill();
  strokeWeight(1);
  beginShape();
  for (let p of points) {
    vertex(p.x + originOffset.x, p.y + originOffset.y);
  }
  endShape();

  // ✳️ Draw GRID around the tracer's current position
  drawMovingGrid(tracer, tracerScreen);

  // 🔵 Draw path
  stroke(0, 150, 255);
  noFill();
  beginShape();
  for (let p of path) {
    vertex(p.x, p.y);
  }
  endShape();

  // 🔴 Draw tracer
  fill(255, 0, 0);
  noStroke();
  ellipse(tracerScreen.x, tracerScreen.y, 10);

  // 💬 Show current tracer coordinates
  fill(0);
  textAlign(LEFT, BOTTOM);
  textSize(14);
  text(`Tracer: (${Math.round(tracer.x)}, ${Math.round(tracer.y)})`, 10, height - 10);
}

function drawMovingGrid(tracer, tracerScreen) {
  const gridSize = 25;       // Distance between grid lines
  const axisLength = 400;    // Half length for big axis
  const tickSize = 5;

  strokeWeight(1);
  textSize(10);
  fill(0);

  // Horizontal (X) grid lines and ticks
  for (let i = -axisLength; i <= axisLength; i += gridSize) {
    let y = tracerScreen.y + i;
    stroke(240);
    line(0, y, width, y); // grid line
    if (i !== 0) {
      stroke(0);
      line(tracerScreen.x - tickSize, y, tracerScreen.x + tickSize, y); // tick mark
      noStroke();
      text(`${Math.round(tracer.y + i)}`, tracerScreen.x + tickSize + 2, y + 3);
    }
  }

  // Vertical (Y) grid lines and ticks
  for (let i = -axisLength; i <= axisLength; i += gridSize) {
    let x = tracerScreen.x + i;
    stroke(240);
    line(x, 0, x, height); // grid line
    if (i !== 0) {
      stroke(0);
      line(x, tracerScreen.y - tickSize, x, tracerScreen.y + tickSize); // tick mark
      noStroke();
      textAlign(CENTER, TOP);
      text(`${Math.round(tracer.x + i)}`, x, tracerScreen.y + tickSize + 2);
    }
  }

  // Draw main moving axis lines
  stroke(0);
  strokeWeight(2);
  line(tracerScreen.x - axisLength, tracerScreen.y, tracerScreen.x + axisLength, tracerScreen.y); // X-axis
  line(tracerScreen.x, tracerScreen.y - axisLength, tracerScreen.x, tracerScreen.y + axisLength); // Y-axis

  // Label axis origin
  noStroke();
  fill(0);
  textAlign(LEFT, TOP);
  text(`(${Math.round(tracer.x)}, ${Math.round(tracer.y)})`, tracerScreen.x + 5, tracerScreen.y + 5);
}
