import { combineReducers } from 'redux';
import { delay, SagaIterator } from 'redux-saga';
import { call, cancel, cancelled, fork, put, race, take } from 'redux-saga/effects';
import { ISessionService } from '../../utils/SessionService';
import { actionCreatorFactory, IAction, IAnyAction, isType } from '../action';
import { ISession, Token } from '../state';
import { locationChange } from './router';

/**
 * Actions
 */
export const LOGIN_REQUEST = '@@session/LOGIN_REQUEST';

const actionCreator = actionCreatorFactory('@@session');
const loginRequest = actionCreator<{ username: string, password: string }>('LOGIN_REQUEST');
const loginSuccess = actionCreator<string>('LOGIN_SUCCESS');
const loginFailure = actionCreator<string>('LOGIN_FAILURE');
const loginCancel = actionCreator<string>('LOGIN_CANCEL');
const logoutRequest = actionCreator('LOGOUT_REQUEST');
const logoutSuccess = actionCreator('LOGOUT_SUCCESS');
const logoutFailure = actionCreator<string>('LOGOUT_FAILURE');

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

    if (yield take(loginCancel.type)) {
      yield cancel(task);
    }

    yield take([loginFailure.type, loginRequest.type]);
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
