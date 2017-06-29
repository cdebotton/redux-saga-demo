import { combineReducers } from 'redux';
import { delay, SagaIterator } from 'redux-saga';
import { call, cancel, cancelled, fork, put, race, take } from 'redux-saga/effects';
import { ISessionService } from '../../utils/SessionService';
import { actionCreatorFactory, IAction, IAnyAction, isType } from '../action';
import { ISession, Token } from '../state';
import { locationChange, push } from './router';

/**
 * Actions
 */
export const LOGIN_REQUEST = '@@session/LOGIN_REQUEST';

const actionCreator = actionCreatorFactory('@@session');
export const loginRequest = actionCreator<{ username: string, password: string }>('LOGIN_REQUEST');
export const loginSuccess = actionCreator<string>('LOGIN_SUCCESS');
export const loginFailure = actionCreator<string>('LOGIN_FAILURE');
export const loginCancel = actionCreator('LOGIN_CANCEL');
export const logoutRequest = actionCreator('LOGOUT_REQUEST');
export const logoutSuccess = actionCreator('LOGOUT_SUCCESS');
export const logoutFailure = actionCreator<string>('LOGOUT_FAILURE');

// Sagas
/**
 *  Process for logging in a user. Login should fail if it takes longer than 2 seconds.
 * @param username string
 * @param password string
 * @param session ISessionService
 */
export function* login(username: string, password: string, session: ISessionService) {
  try {
    const { navigateAway, token, timeout } = yield race({
      navigateAway: take(locationChange.type),
      timeout: call(delay, 2000),
      token: call(session.login, username, password),
    });

    if (token) {
      yield put(loginSuccess(token));
    } else if (navigateAway) {
      yield put(loginFailure('You navigated away.'));
    } else if (timeout) {
      yield put(loginFailure('Login timed out'));
    }
  } catch (err) {
    yield put(loginFailure(err.toString()));
  } finally {
    if (yield cancelled()) {
      yield put(loginFailure('Login cancelled.'));
    }
  }
}

/**
 * Process for logging out a user
 * @param session ISessionService
 */
export function* logout(session: ISessionService) {
  try {
    yield call(session.logout);
    yield put(logoutSuccess());
    yield put(push('/'));
  } catch (err) {
    yield put(logoutFailure(err.toString()));
  }
}

/**
 * Root session saga. Awaits to log a user in, cancels the login request if the user
 * attempts to navigate away from the log in page. If and only if the user is logged in,
 * they can log out.
 * @param session ISessionService
 */
export function* sessionSaga(session: ISessionService): SagaIterator {
  while (true) {
    const { payload: { username, password } } = yield take(LOGIN_REQUEST);
    const task = yield fork(login, username, password, session);

    if (yield take(loginCancel.type)) {
      yield cancel(task);
    }

    yield take([loginFailure.type, logoutRequest.type]);
    yield fork(logout, session);
  }
}

// Reducers
const token = (state: Token = null, action: IAnyAction): Token => {
  if (isType(action, loginSuccess)) {
    return action.payload;
  }
  return state;
};

const error = (state: string = null, action: IAnyAction): string => {
  if (isType(action, loginFailure)) {
    return action.payload;
  }

  return state;
};

const loading = (state: boolean = false, action: IAnyAction): boolean => {
  return state;
};

const sessionReducer = combineReducers<ISession>({
  token,
  error,
  loading,
});

export default sessionReducer;
