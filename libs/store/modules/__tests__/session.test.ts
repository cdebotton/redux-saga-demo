import { delay } from 'redux-saga';
import { call, cancel, cancelled, fork, put, race, take } from 'redux-saga/effects';
import { createMockTask } from 'redux-saga/utils';
import { ISessionService } from '../../../utils/SessionService';
import { locationChange } from '../router';
import {
  login,
  LOGIN_REQUEST,
  loginCancel,
  loginFailure,
  loginSuccess,
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
  describe('login flow', () => {

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

  describe('login generator', () => {
    const username = 'foo';
    const password = 'bar';

    it('should invoke loginSuccess with the resolved token if successful', () => {
      const session = new MockSuccessfulSessionService();
      const loginIterator = login(username, password, session);
      const TOKEN = 'success';

      it('should result in calling loginSuccess with the token', () => {
        expect(loginIterator.next().value).toEqual(race({
          navigateAway: take(locationChange.type),
          timeout: call(delay, 2000),
          token: call(session.login, username, password),
        }));

        expect(loginIterator.next({ token: TOKEN }).value)
          .toEqual(put(loginSuccess(TOKEN)));
      });
    });

    it('should invoke loginFailure with timeout if it times out', () => {
      const session = new MockSuccessfulSessionService();
      const loginIterator = login(username, password, session);
      expect(loginIterator.next().value).toEqual(race({
        navigateAway: take(locationChange.type),
        timeout: call(delay, 2000),
        token: call(session.login, username, password),
      }));

      expect(loginIterator.next({ timeout: true }).value)
        .toEqual(put(loginFailure('Login timed out')));
    });

    it('should invoke loginFailure with a notice that the user navigated away', () => {
      const session = new MockSuccessfulSessionService();
      const loginIterator = login(username, password, session);
      expect(loginIterator.next().value).toEqual(race({
        navigateAway: take(locationChange.type),
        timeout: call(delay, 2000),
        token: call(session.login, username, password),
      }));

      expect(loginIterator.next({ navigateAway: true }).value)
        .toEqual(put(loginFailure('You navigated away.')));
    });

    it('should return loginFailure with the server error message if there is an error', () => {
      const session = new MockUnsuccessfulSessionService();
      const loginIterator = login(username, password, session);
      expect(loginIterator.next().value).toEqual(race({
        navigateAway: take(locationChange.type),
        timeout: call(delay, 2000),
        token: call(session.login, username, password),
      }));

      expect(loginIterator.throw('bad').value)
        .toEqual(put(loginFailure('bad')));
    });

    it('should dispatch a loginCancelled action if cancelled', () => {
      const session = new MockUnsuccessfulSessionService();
      const loginIterator = login(username, password, session);
      expect(loginIterator.next().value).toEqual(race({
        navigateAway: take(locationChange.type),
        timeout: call(delay, 2000),
        token: call(session.login, username, password),
      }));

      expect(loginIterator.next({}).value)
        .toEqual(cancelled());
    });
  });
});
