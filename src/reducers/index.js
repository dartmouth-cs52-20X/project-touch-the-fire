// the starting point for your redux store
// this defines what your store state will look like
import { combineReducers } from 'redux';

import UserReducer from './user-reducer';
import ChatReducer from './chat-reducer';

const rootReducer = combineReducers({
  username: UserReducer,
  chatMessages: ChatReducer,
});

export default rootReducer;
