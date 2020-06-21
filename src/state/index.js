import { combineReducers } from 'redux';
import verifyReducer from './modules/verify';

const reducer = combineReducers({
  verify: verifyReducer
});

export default reducer;
export const state = (state) => state;
