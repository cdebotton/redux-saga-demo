import { combineReducers } from 'redux';
import { delay, SagaIterator } from 'redux-saga';
import { call, cancel, cancelled, fork, put, race, take } from 'redux-saga/effects';
import { ISessionService } from '../../utils/SessionService';
import { IAction } from '../action';
import { ISession, Token } from '../state';
import { LOCATION_CHANGE } from './router';

/**
 * Actions
 */
export const LOGIN_REQUEST = '@@session/LOGIN_REQUEST';
export const LOGIN_SUCCESS = '@@session/LOGIN_SUCCESS';
export const LOGIN_FAILURE = '@@session/LOGIN_FAILURE';
export const LOGIN_CANCEL = '@@session/LOGIN_CANCEL';
export const LOGOUT_REQUEST = '@@session/LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = '@@session/LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = '@@session/LOGOUT_FAILURE';

const loginSuccess = (token: string): IAction<string> => ({
  payload: token,
  type: LOGIN_SUCCESS,
});

const loginFailure = (error: string): IAction<string> => ({
  error: true,
  payload: error,
  type: LOGIN_FAILURE,
});

const logoutSuccess = (): IAction<void> => ({
  payload: undefined,
  type: LOGOUT_SUCCESS,
});

const logoutFailure = (err: string): IAction<string> => ({
  error: true,
  payload: err,
  type: LOGOUT_FAILURE,
});

// Sagas
/**
 *  Process for logging in a user. Login should fail if it takes longer than 2 seconds.
 * @param username string
 * @param password string
 * @param session ISessionService
 */
function* login(username: string, password: string, session: ISessionService) {
  try {
    const { navigateAway, token, timeout } = yield race({
      navigateAway: take(LOCATION_CHANGE),
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
function* logout(session: ISessionService) {
  try {
    yield call(session.logout);
    yield put(logoutSuccess());
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

    if (yield take(LOGIN_CANCEL)) {
      yield cancel(task);
    }

    yield take([LOGIN_FAILURE, LOGOUT_REQUEST]);
    yield fork(logout, session);
  }
}

// Reducers
const token = (value: Token = null, action: IAction<Token>): Token => {
  return value;
};

const error = (value: string = null, action: IAction<string>): string => {
  if (action.type === LOGIN_FAILURE) {
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
