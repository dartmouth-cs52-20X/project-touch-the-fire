/* eslint-disable prefer-object-spread */
import { ActionTypes } from '../actions';

const initialState = {
  current_user: '',
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SIGNIN:
      return (Object.assign({}, state, { current_user: action.payload }));
    case ActionTypes.SIGNOUT:
      return (Object.assign({}, state, { current_user: '' }));
    default:
      return state;
  }
};

export default UserReducer;
