import { cancel, fork, take } from 'redux-saga/effects';
import { createMockTask } from 'redux-saga/utils';
import { ISessionService } from '../../../utils/SessionService';
import {
  login,
  LOGIN_REQUEST,
  loginCancel,
  loginFailure,
  logout,
  logoutRequest,
  sessionSaga,
} from '../session';

class MockSuccessfulSessionService implements ISessionService {
  public login = (username: string, password: string) => Promise.resolve('success');
  public logout = () => Promise.resolve();
}

class MockUnsuccessfulSessionService implements ISessionService {
  public login = (username: string, password: string) => Promise.reject('bad creds');

  public logout = () => Promise.reject('nope');
}

describe('Session Saga', () => {
  describe('successful login', () => {
    const session = new MockSuccessfulSessionService();
    const sessionIterator = sessionSaga(session);

    const username = 'foo';
    const password = 'bar';
    const action = { type: LOGIN_REQUEST, payload: { username, password } };

    it('should await a LOGIN_REQUEST action.', () => {
      expect(sessionIterator.next().value)
        .toEqual(take(LOGIN_REQUEST));
    });

    it('should fork a process to authenticate the user.', () => {
      expect(sessionIterator.next(action).value)
        .toEqual(fork(login, username, password, session));
    });

    it('should optionally await a login cancel', () => {
      expect(sessionIterator.next().value)
        .toEqual(take(loginCancel.type));
    });

    it('should await either a loginFailure or a logoutRequest', () => {
      expect(sessionIterator.next().value)
        .toEqual(take([loginFailure.type, logoutRequest.type]));
    });

    it('should logout the user if either of the previous actions are received', () => {
      expect(sessionIterator.next().value)
        .toEqual(fork(logout, session));
    });
  });

  describe('cancelled login', () => {
    const session = new MockUnsuccessfulSessionService();
    const sessionIterator = sessionSaga(session);

    const username = 'foo';
    const password = 'bar';
    const loginAction = { type: LOGIN_REQUEST, payload: { username, password } };

    it('should await a LOGIN_REQUEST action.', () => {
      expect(sessionIterator.next().value)
        .toEqual(take(LOGIN_REQUEST));
    });

    it('should fork a process to authenticate the user.', () => {
      expect(sessionIterator.next(loginAction).value)
        .toEqual(fork(login, username, password, session));
    });

    const mockTask = createMockTask();
    it('should await a login cancel', () => {
      expect(sessionIterator.next(mockTask).value)
        .toEqual(take(loginCancel.type));
    });

    it('should invoke cancel on the task if requested', () => {
      expect(sessionIterator.next(mockTask).value)
        .toEqual(cancel(mockTask));
    });
  });
});
