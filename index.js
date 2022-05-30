var grid = [];
var snakeBody = [];
var snakeSize = 0;
var tickRate = 100;
var width;
var height;
var direction = "right";
var going = "right";
var interval;
var running = false;

const sounds = {
  eat: new Audio("sounds/eat.wav"),
  food_spawn: new Audio("sounds/food_spawn.wav"),
  hiss: new Audio("sounds/hiss.wav"),
  hit_barrier: new Audio("sounds/hit_barrier.wav"),
};

var food_location = { x: null, y: null };

const directions = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

document.addEventListener("keydown", function (e) {
  if (!running) {
    return;
  }
  e.preventDefault();
  if (e.key in directions) {
    direction = directions[e.key];
  }
});

function draw() {
  reset();
  height = Math.max(5, document.getElementById("height").value);
  width = Math.max(5, document.getElementById("width").value);
  tickRate = document.getElementById("tick-rate").value;
  let snakeGrid = document.getElementById("snake-grid");
  let cellSize = window.screen.width / 3 / width;
  snakeGrid.innerHTML = "";
  for (let x = 0; x < height; x++) {
    let rowArray = [];
    let row = document.createElement("div");
    row.style.height = cellSize + "px";
    row.className = "row";
    for (let y = 0; y < width; y++) {
      let cell = document.createElement("div");
      cell.style.height = cellSize + "px";
      cell.style.width = cellSize + "px";
      cell.id = `${y}-${x}`;
      cell.className = "cell";
      rowArray.push(cell);
      row.appendChild(cell);
    }
    snakeGrid.appendChild(row);
    grid.push(rowArray);
  }
  if (snakeBody.length === 0 && width >= 4 && height >= 4) {
    let middle = Math.floor(height / 2);
    snakeBody.push({ x: 1, y: middle });
    snakeBody.push({ x: 2, y: middle });
    snakeBody.push({ x: 3, y: middle });
  }
  snakeSize = 3;
  food();
  running = true;
  interval = window.setInterval(update, tickRate);
}

function update() {
  // Makes sure user can't go backwards
  if (going == "right" && direction == "left") {
    direction = "right";
  }
  if (going == "left" && direction == "right") {
    direction = "left";
  }
  if (going == "up" && direction == "down") {
    direction = "up";
  }
  if (going == "down" && direction == "up") {
    direction = "down";
  }

  if (going != direction && Math.random() > 0.5) {
    sounds.hiss.play();
  }

  addDirection();
  let removed = snakeBody.shift();
  document.getElementById(`${removed.x}-${removed.y}`).className = "cell";
  for (let x = 0; x < snakeSize; x++) {
    // Check if snake is out of bounds
    if (
      snakeBody[x].x < 0 ||
      snakeBody[x].x >= width ||
      snakeBody[x].y < 0 ||
      snakeBody[x].y >= height
    ) {
      stop();
      alert("You lost!");
    }
    // Check if snake is eating itself
    for (let y = 0; y < snakeSize; y++) {
      if (
        snakeBody[x].x == snakeBody[y].x &&
        snakeBody[x].y == snakeBody[y].y &&
        y != x
      ) {
        stop();
        alert("You lost!");
      }
    }
    if (
      snakeBody[x].x == food_location.x &&
      snakeBody[x].y == food_location.y
    ) {
      console.log(snakeSize);
      addDirection();
      sounds.eat.play();
      food();
    }
    document.getElementById(snakeBody[x].x + "-" + snakeBody[x].y).className =
      "cell snake-body";
  }
  going = direction;
}

function addDirection() {
  snakeSize = snakeBody.length;
  switch (direction) {
    case "right":
      snakeBody.push({
        x: snakeBody[snakeSize - 1].x + 1,
        y: snakeBody[snakeSize - 1].y,
      });
      break;
    case "left":
      snakeBody.push({
        x: snakeBody[snakeSize - 1].x - 1,
        y: snakeBody[snakeSize - 1].y,
      });
      break;
    case "up":
      snakeBody.push({
        x: snakeBody[snakeSize - 1].x,
        y: snakeBody[snakeSize - 1].y - 1,
      });
      break;
    case "down":
      snakeBody.push({
        x: snakeBody[snakeSize - 1].x,
        y: snakeBody[snakeSize - 1].y + 1,
      });
      break;
  }
}

function food() {
  sounds.food_spawn.play();
  let x = Math.floor(Math.random() * width);
  let y = Math.floor(Math.random() * height);
  food_location = { x: x, y: y };
  document.getElementById(`${x}-${y}`).className = "cell food";
}

function reset() {
  grid = [];
  snakeBody = [];
  direction = "right";
  going = "right";
  running = false;
}

function stop() {
  sounds.hit_barrier.play();
  document.getElementById("snake-grid").innerHTML = "";
  window.clearInterval(interval);
  running = false;
  reset();
}
