let points = [];
let currentSegment = 0;
let t = 0;
const duration = 4000;
let lastMillis;
let path = [];
let originOffset;

function setup() {
  createCanvas(500, 500);
  originOffset = createVector(width / 2, height / 2);
  lastMillis = millis();

  // Maze-like path
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

  // Draw static maze path
  stroke(0);
  noFill();
  strokeWeight(1);
  beginShape();
  for (let p of points) {
    vertex(p.x + originOffset.x, p.y + originOffset.y);
  }
  endShape();

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

  // Draw path
  stroke(0, 150, 255);
  noFill();
  beginShape();
  for (let p of path) {
    vertex(p.x, p.y);
  }
  endShape();

  // 🧭 Draw moving axis at tracer position
  let axisSize = 30;
  stroke(100);
  strokeWeight(1.5);
  line(tracerScreen.x - axisSize, tracerScreen.y, tracerScreen.x + axisSize, tracerScreen.y); // X-axis
  line(tracerScreen.x, tracerScreen.y - axisSize, tracerScreen.x, tracerScreen.y + axisSize); // Y-axis

  // 🏷️ Show coordinates at the tracer
  noStroke();
  fill(0);
  textSize(12);
  textAlign(LEFT, TOP);
  text(`(${Math.round(tracer.x)}, ${Math.round(tracer.y)})`, tracerScreen.x + 5, tracerScreen.y + 5);

  // 🔴 Draw tracer
  fill(255, 0, 0);
  noStroke();
  ellipse(tracerScreen.x, tracerScreen.y, 10);

  // 🧾 Optional: Show tracer's coords in a fixed spot
  fill(0);
  textAlign(LEFT, BOTTOM);
  textSize(14);
  text(`Tracer: (${nf(tracer.x, 1, 0)}, ${nf(tracer.y, 1, 0)})`, 10, height - 10);
}
