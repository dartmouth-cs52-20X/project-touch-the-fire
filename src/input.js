/* eslint-disable no-mixed-operators */
import { updateDirection } from './networking';

/*
  Keycodes: 40 - Down, 37 - Left, 38 - Up, 39 - Right
*/

// This function takes care of user movement
export function startCapturingInput() {
  // key codes + direction pairs are used to change direction based on input

  // as specified it currently supports wasd and arrow key movement
  const dirKeys = {
    37: -Math.PI / 2, // left
    38: 0, // up
    39: Math.PI / 2, // right
    40: Math.PI, // down
    65: -Math.PI / 2, // a
    87: 0, // w
    68: Math.PI / 2, // d
    83: Math.PI, // s
  };

  const listKeysPressed = {};
  let newDir = 0;
  console.log(listKeysPressed);
  // this checks to see if any keys have been pressed
  window.addEventListener('keydown', (event) => {
    newDir = 0;
    listKeysPressed[event.keyCode] = true;
    console.log(listKeysPressed);

    // sums up the values and averages them to get the new direction
    Object.keys(listKeysPressed).forEach((key) => {
      newDir += Math.abs(dirKeys[key]);
    });
    newDir /= Object.keys(listKeysPressed).length;

    if (37 in listKeysPressed || 65 in listKeysPressed) {
      newDir *= -1;
    }

    console.log('happening');
    updateDirection(newDir, 1);
    console.log(newDir);
  });

  window.addEventListener('keyup', (event) => {
    delete listKeysPressed[event.keyCode];
    console.log('fake news');
    console.log(listKeysPressed);

    if (Object.keys(listKeysPressed).length === 0) {
      console.log('not happening');
      updateDirection(newDir, 0);
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
