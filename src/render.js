import { getCurrentState } from './state';
import Constants from './constants/constants';

const { PLAYER_RADIUS, MAP_SIZE } = Constants;

const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

const hanlonhead = new Image();
hanlonhead.src = 'https://www.dartblog.com/images/Hanlon1.jpg';

const fire = new Image();
fire.src = 'https://www.nicepng.com/png/full/824-8249426_fire-svg-png-icon-free-download-onlinewebfonts-flame.png';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function renderPlayer(me, player) {
  const { x, y, direction } = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  // context.imageSmoothingEnabled = false;
  context.drawImage(
    hanlonhead,
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2,
  );

  context.restore();
}

function renderBackground(x, y) {
  const backgroundX = MAP_SIZE / 2 - x + canvas.width / 2;
  const backgroundY = MAP_SIZE / 2 - y + canvas.height / 2;
  const backgroundGradient = context.createRadialGradient(
    backgroundX,
    backgroundY,
    MAP_SIZE / 10,
    backgroundX,
    backgroundY,
    MAP_SIZE / 2,
  );
  backgroundGradient.addColorStop(0, 'yellow');
  backgroundGradient.addColorStop(0.25, 'blue');
  backgroundGradient.addColorStop(0.5, 'red');
  backgroundGradient.addColorStop(0.75, 'orange');
  backgroundGradient.addColorStop(1, 'green');
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.drawImage(fire, backgroundX, backgroundY, 50, 100);
}

function render() {
  const { me, others } = getCurrentState();
  if (!me) {
    return;
  }

  renderBackground(me.x, me.y);

  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);

  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));
}

let renderInterval = null;
export function startRendering() {
  renderInterval = setInterval(render, 1000 / 60);
}
export function stopRendering() {
  clearInterval(renderInterval);
}
