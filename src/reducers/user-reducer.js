import { ActionTypes } from '../actions';

const UserReducer = (state = 0, action) => {
  switch (action.type) {
    case ActionTypes.SIGNIN:
      return { username: action.payload };
    default:
      return state;
  }
};

export default UserReducer;
