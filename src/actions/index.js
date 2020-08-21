// keys for actiontypes
export const ActionTypes = {
  SIGNIN: 'SIGNIN',
  SET_CHAT_MESSAGES: 'SET_CHAT_MESSAGES',
  CREATE_CHAT_MESSAGE: 'CREATE_CHAT_MESSAGE',
};

export function signIn(username) {
  return {
    type: ActionTypes.SIGNIN,
    payload: username,
  };
}

export function decrement() {
  return {
    type: ActionTypes.DECREMENT,
    payload: null,
  };
}

// For reference
// https://medium.com/@gethylgeorge/using-socket-io-in-react-redux-app-to-handle-real-time-data-c0e734297795
export function setChatMessages(chatMessages) {
  return {
    type: ActionTypes.SET_CHAT_MESSAGES,
    payload: chatMessages,
  };
}

export function createChatMessage(socket, chatMessage) {
  return (dispatch) => {
    const fields = {
      username: chatMessage.username,
      message: chatMessage.message,
    };
    socket.emit('createChatMessage', fields);
    dispatch({ type: ActionTypes.CREATE_CHAT_MESSAGE, payload: chatMessage });
  };
}
