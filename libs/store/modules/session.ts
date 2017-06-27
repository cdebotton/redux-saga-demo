import { combineReducers } from 'redux';
import { SagaIterator } from 'redux-saga';
import { take } from 'redux-saga/effects';
import { IAction } from '../action';
import { ISession, Token } from '../state';

export const LOGIN_REQUEST = '@@session/LOGIN_REQUEST';

export function* sessionSaga(): SagaIterator {
  while (true) {
    const action = yield take(LOGIN_REQUEST);
    console.log(action);
  }
}

const token = (value: Token = null, action: IAction<Token>): Token => {
  return value;
};

const error = (value: string = null, action: IAction<string>): string => {
  if (action.type === 'LOGIN_FAILURE') {
    return action.payload;
  }

  return value;
};

const loading = (value: boolean = false, action: IAction<boolean>): boolean => {
  return value;
};

const sessionReducer = combineReducers<ISession>({
  token,
  error,
  loading,
});

export default sessionReducer;
