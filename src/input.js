import { updateDirection } from './networking';

export function startCapturingInput() {
  window.addEventListener('keydown', (event) => {
    if (event.keyCode === 37) {
      updateDirection(-Math.PI / 2);
    } else if (event.keyCode === 39) {
      updateDirection(Math.PI / 2);
    } else if (event.keyCode === 38) {
      updateDirection(0);
    } else if (event.keyCode === 40) {
      updateDirection(Math.PI);
    }
  });
}

export function stopCapturingInput() {
  window.removeEventListener('keydown', (event) => {
    if (event.keyCode === 37) {
      updateDirection(-Math.PI / 2);
    } else if (event.keyCode === 39) {
      updateDirection(Math.PI / 2);
    } else if (event.keyCode === 38) {
      updateDirection(0);
    } else if (event.keyCode === 40) {
      updateDirection(Math.PI);
    }
  });
}
