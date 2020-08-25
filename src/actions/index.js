// keys for actiontypes
export const ActionTypes = {
  SIGNIN: 'SIGNIN',
  SIGNOUT: 'SIGNOUT',
  SET_CHAT_MESSAGES: 'SET_CHAT_MESSAGES',
  CREATE_CHAT_MESSAGE: 'CREATE_CHAT_MESSAGE',
  CLEAR_CHAT: 'CLEAR_CHAT',
};

export function signIn(username) {
  return {
    type: ActionTypes.SIGNIN,
    payload: username,
  };
}

export function signOut() {
  return {
    type: ActionTypes.SIGNOUT,
  };
}

// For guidance
// https://medium.com/@gethylgeorge/using-socket-io-in-react-redux-app-to-handle-real-time-data-c0e734297795
export function setChatMessages(chatMessages) {
  return {
    type: ActionTypes.SET_CHAT_MESSAGES,
    payload: chatMessages,
  };
}

// Pass a temporary id to set in the redux store (will be replaced when the server sends back the actual id)
// This helps to avoid a unique key error --> looking for a better solution, but this works for now
export function createChatMessage(socket, chatMessage) {
  return (dispatch) => {
    const fields = {
      username: chatMessage.username,
      message: chatMessage.message,
      id: 1,
    };
    socket.emit('createChatMessage', chatMessage);
    dispatch({ type: ActionTypes.CREATE_CHAT_MESSAGE, payload: fields });
  };
}

export function clearChat(socket) {
  return (dispatch) => {
    socket.emit('clearChat');
    dispatch({ type: ActionTypes.CLEAR_CHAT });
  };
}
