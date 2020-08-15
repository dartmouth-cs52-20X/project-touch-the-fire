/* eslint-disable no-mixed-operators */
import { updateDirection } from './networking';

/*
  Keycodes: 40 - Down, 37 - Left, 38 - Up, 39 - Right
*/

export function startCapturingInput() {
  const dirKeys = {
    37: -Math.PI / 2,
    38: 0,
    39: Math.PI / 2,
    40: Math.PI,
  };
  const listKeysPressed = {};
  window.addEventListener('keydown', (event) => {
    listKeysPressed[event.keyCode] = true;
    console.log(listKeysPressed);
    let newDir = 0;
    Object.keys(listKeysPressed).forEach((key) => {
      newDir += Math.abs(dirKeys[key]);
    });
    newDir /= Object.keys(listKeysPressed).length;

    if (37 in listKeysPressed) {
      newDir *= -1;
    }

    updateDirection(newDir);
  });

  window.addEventListener('keyup', (event) => {
    delete listKeysPressed[event.keyCode];
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
