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

export const play = (username) => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
};

export const updateDirection = (dir) => {
  socket.emit(Constants.MSG_TYPES.INPUT, dir);
};
