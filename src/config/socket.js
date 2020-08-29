import io from 'socket.io-client';

// const socket = io('http://localhost:9090');

const socket = io('https://touchthefirechat.herokuapp.com/');

export default socket;
