// keys for actiontypes
export const ActionTypes = {
  SIGNIN: 'SIGNIN',
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
