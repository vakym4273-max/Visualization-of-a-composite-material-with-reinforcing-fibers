// Композитный материал: матрица с волокнами
let fibers = [];
let stress = 0;
let loadAngle = 0;

function setup() {
  createCanvas(800, 600);
  
  // Создание волокон
  for (let i = 0; i < 60; i++) {
    fibers.push({
      x: random(width),
      y: random(height),
      length: random(50, 150),
      angle: random(PI),
      color: color(200, 150, 100),
      stress: 0
    });
  }
}

function draw() {
  background(240, 240, 255);
  
  drawMatrix();
  
  // Обновление и отрисовка волокон
  for (let i of fibers) {
    updateFiber(i);
    drawFiber(i);
  }
  
  drawInfo();
  drawLoadDirection();
}

function drawMatrix() {
  // Трещины в матрице при высоком напряжении
  if (stress > 50) {
    stroke(100, 100, 150, 100);
    strokeWeight(1);
    for (let i = 0; i < 10; i++) {
      let x = random(width);
      let y = random(height);
      line(x, y, x + random(20, 50), y + random(-10, 10));
    }
  }
}

function updateFiber(f) {
  // Вычисление напряжения в волокне
  let fiberAngle = f.angle;
  let angleDiff = abs(fiberAngle - loadAngle);
  
  if (angleDiff < PI/4) {
    f.stress = stress * (1 - angleDiff / 1.5);
  } else {
    f.stress = stress * 0.3;
  }
  
  // Цветовая палитра от зелёного к красному
  let stressLevel = constrain(f.stress / 100, 0, 1);
  
  if (stressLevel < 0.5) {
    // Зелёный → жёлтый (0-50% нагрузки)
    f.color = color(
      255 * (stressLevel * 2),
      255,
      0
    );
  } else {
    // Жёлтый → красный (50-100% нагрузки)
    f.color = color(
      255,
      255 * (1 - (stressLevel - 0.5) * 2),
      0
    );
  }
}

function drawFiber(f) {
  push();
  translate(f.x, f.y);
  rotate(f.angle);
  
  fill(f.color);
  noStroke();
  rect(-f.length/2, -3, f.length, 6);
  
  // Индикатор разрушения при высоком напряжении
  if (f.stress > 80) {
    fill(255, 0, 0, 100);
    ellipse(0, 0, 10, 10);
  }
  
  pop();
}

function drawInfo() {
  fill(0);
  textSize(16);
  text("Композитный материал: матрица с волокнами", 20, 30);
  textSize(14);
  text("Напряжение: " + stress.toFixed(0), 20, 55);
  text("Угол нагрузки: " + int(degrees(loadAngle)) + "°", 20, 75);
  text("Инструкция:", 20, height - 60);
  text("Стрелки вверх/вниз - изменить нагрузку", 20, height - 40);
  text("Стрелки влево/вправо - изменить направление", 20, height - 20);
}

function drawLoadDirection() {
  push();
  translate(width/2, 50);
  rotate(loadAngle);
  
  stroke(255, 0, 0);
  strokeWeight(3);
  line(0, 0, 50, 0);
  
  fill(255, 0, 0);
  triangle(50, 0, 40, -10, 40, 10);
  
  pop();
}

function keyPressed() {
  // Управление нагрузкой
  if (keyCode === UP_ARROW) {
    stress = min(100, stress + 10);
  } else if (keyCode === DOWN_ARROW) {
    stress = max(0, stress - 10);
  } 
  // Управление направлением
  else if (keyCode === LEFT_ARROW) {
    loadAngle -= PI/18;
    if (loadAngle < 0) loadAngle = 0;
  } else if (keyCode === RIGHT_ARROW) {
    loadAngle += PI/18;
    if (loadAngle > PI) loadAngle = PI;
  }
}

function mousePressed() {
  // Добавление нового волокна
  fibers.push({
    x: mouseX,
    y: mouseY,
    length: random(50, 150),
    angle: random(PI),
    color: color(200, 150, 100),
    stress: 0
  });
}
