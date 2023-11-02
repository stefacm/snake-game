// Determinan cuando el juego está CORRIENDO o PERDIENDO respectivamente
const STATE_RUNNING = 1;
const STATE_LOSING = 2;

const TICK = 80; // Intervalos de tiempos en que se dará el desplazamiento de la serpiente en milisengundos
const SQUARE_SIZE = 10; // Tamaño de cada uno de los cuadros que se van a dibujar sobre el area de juego

// Ancho y alto del tamaño del juego. Es decir, cuantos cuadritos cabran en el
const BOARD_WIDTH = 50;
const BOARD_HEIGHT = 50;

const GROW_SCALE = 10; // Cuantos cuadros de longitud crecerá la serpiente cada vez que se alimente

// Determinan la dirección en la que se moverá la serpiente. Desplazamiento en X : Desplazamiento en Y
const DIRECTIONS_MAP = {
  'A': [-1, 0],
  'D': [1, 0],
  'S': [0, 1],
  'W': [0, -1],
  'a': [-1, 0],
  'd': [1, 0],
  's': [0, 1],
  'w': [0, -1],
};

let state = {
  canvas: null,
  context: null,
  snake: [{ x: 0, y: 0 }],
  direction: { x: 1, y: 0 },
  prey: { x: 0, y: 0 },
  growing: 0,
  runState: STATE_RUNNING
};

function randomXY() {
  return {
    x: parseInt(Math.random() * BOARD_WIDTH),
    y: parseInt(Math.random() * BOARD_HEIGHT)
  }
}

function tick() {
  const head = state.snake[0];
  const dx = state.direction.x;
  const dy = state.direction.y;
  const hightestIndex = state.snake.length - 1;
  let tail = {};
  let interval = TICK;

  Object.assign(tail, state.snake.length - 1); // copiar el ultimo objeto de la serpiente en la variable tail

  let didScore = (head.x === state.prey.x && head.y === state.prey.y);

  if (state.runState === STATE_RUNNING) {
    for (let idx = hightestIndex; idx > -1; idx--) {
      const sq = state.snake[idx];

      if (idx === 0) { // Es la cabeza de la serpiente?
        sq.x += dx;
        sq.y += dy;
      } else {
        sq.x = state.snake[idx - 1].x;
        sq.y = state.snake[idx - 1].y;
      }
    }
  }

  if (didScore) {
    state.growing += GROW_SCALE;
    state.prey = randomXY();
  }

  if (state.growing > 0) {
    state.snake.push(tail);
    state.growing--;
  }

  requestAnimationFrame(draw);
  setTimeout(tick, interval)
}

function drawPixel(color, x, y) {
  state.context.fillStyle = color;
  state.context.fillRect(
    x * SQUARE_SIZE,
    y * SQUARE_SIZE,
    SQUARE_SIZE,
    SQUARE_SIZE
  );
}

function draw() {
  state.context.clearRect(0, 0, 500, 500);

  for (const element of state.snake) {
    const { x, y } = element;
    drawPixel("#22dd22", x, y);
  }

  const { x, y } = state.prey;
  drawPixel("yellow", x, y);
}

window.onload = function () {
  state.canvas = document.querySelector('canvas');
  state.context = state.canvas.getContext('2d');

  window.onkeydown = function (e) {
    const direction = DIRECTIONS_MAP[e.key];

    if (direction) {
      const [x, y] = direction;
      if (-x !== state.direction.x
        && -y !== state.direction.y) {
        state.direction.x = x;
        state.direction.y = y;
      }
    }
  }

  tick();
};
