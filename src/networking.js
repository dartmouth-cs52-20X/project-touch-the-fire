import io from 'socket.io-client';
import { processGameUpdate } from './state';
import Constants from './constants/constants';

const socket = io('ws://localhost:9090');
const connectedPromise = new Promise((resolve) => {
  socket.on('connect', () => {
    console.log('Connected to server!');
    resolve();
  });
});

export const connect = (onGameOver) => (
  connectedPromise.then(() => {
    // Register callbacks
    socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
    socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
  })
);

// TODO: Write function to collect message from client to send
// TODO: Post received messages into client instead of console

export const chat = () => {
  socket.on(Constants.MSG_TYPES.CHAT, (data) => {
    console.log(data);
  });
};

export const play = (username) => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
};

export const updateDirection = (dir, move) => {
  const packageMoveDir = { dr: dir, mv: move };
  console.log('new imp');
  console.log(packageMoveDir);
  // to server js
  socket.emit(Constants.MSG_TYPES.INPUT, packageMoveDir);
};
