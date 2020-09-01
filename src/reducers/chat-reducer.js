/* eslint-disable prefer-object-spread */
import { ActionTypes } from '../actions';

const initialState = {
  all: [],
};

const ChatReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_CHAT_MESSAGES:
      return (Object.assign({}, state, { all: action.payload }));
    // https://stackoverflow.com/questions/40911194/how-do-i-add-an-element-to-array-in-reducer-of-react-native-redux
    case ActionTypes.CREATE_CHAT_MESSAGE:
      return (Object.assign({}, state, { all: [...state.all, action.payload] }));
    default:
      return state;
  }
};

export default ChatReducer;
