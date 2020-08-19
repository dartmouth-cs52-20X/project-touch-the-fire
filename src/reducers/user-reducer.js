import { ActionTypes } from '../actions';

const UserReducer = (state = 0, action) => {
  switch (action.type) {
    case ActionTypes.SIGNIN:
      return {username: action.payload};
    case ActionTypes.DECREMENT:
      return state - 1;
    default:
      return state;
  }
};

export default CountReducer;
