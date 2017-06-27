import { combineReducers, Reducer } from 'redux';
import { IState } from '../state';
import router from './router';
import session from './session';

const rootReducer = combineReducers<IState>({
  session,
  router,
});

export default rootReducer;
