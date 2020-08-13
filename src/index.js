import { connect, play, chat } from './networking';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { initState } from './state';

const signIn = document.getElementById('sign-in');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username');

function onGameOver() {
  stopCapturingInput();
  stopRendering();
  signIn.classList.remove('hidden');
}

Promise.all([
  connect(onGameOver),
]).then(() => {
  signIn.classList.remove('hidden');
  usernameInput.focus();

  playButton.onclick = () => {
    play(usernameInput.value);
    signIn.classList.add('hidden');
    initState();
    startCapturingInput();
    startRendering();
  };
});
