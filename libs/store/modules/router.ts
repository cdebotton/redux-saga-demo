import { History, Location } from 'history';
import { SagaIterator } from 'redux-saga';
import { call, take } from 'redux-saga/effects';
import { IAction } from '../action';
import { Router } from '../state';

export const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD';
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

type UpdateLocationMethod = 'push' | 'replace' | 'go' | 'goBack' | 'goForward';

const updateLocation = (method: UpdateLocationMethod) => (...args: any[]) => ({
  payload: { method, args },
  type: CALL_HISTORY_METHOD,
});

export const push = updateLocation('push');
export const replace = updateLocation('replace');
export const go = updateLocation('go');
export const goBack = updateLocation('goBack');
export const goForward = updateLocation('goForward');

export function* routerSaga(history: History): SagaIterator {
  while (true) {
    const action: IAction<{
      method: UpdateLocationMethod,
      args: any[],
    }> = yield take(CALL_HISTORY_METHOD);
    if (action.type === CALL_HISTORY_METHOD) {
      const { payload: { method, args } } = action;
      switch (method) {
        case 'push':
          yield call(history.push, args[0], args[1]);
          break;
        case 'replace':
          yield call(history.replace, args[0], args[1]);
          break;
        case 'go':
          yield call(history.go, args[0]);
          break;
        case 'goBack':
          yield call(history.goBack);
          break;
        case 'goForward':
          yield call(history.goBack);
          break;
      }
    }
  }
}

const routerReducer = (state: Router = null, action: IAction<Location>): Router => {
  if (action.type === LOCATION_CHANGE) {
    return action.payload;
  }

  return state;
};

export default routerReducer;
