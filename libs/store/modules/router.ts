import { History, Location } from 'history';
import { SagaIterator } from 'redux-saga';
import { call, take } from 'redux-saga/effects';
import { actionCreatorFactory, IAction, IAnyAction, isType } from '../action';
import { Router } from '../state';

export const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD';
const actionCreator = actionCreatorFactory('@@router');

export const locationChange = actionCreator<Location>('LOCATION_CHANGE');

enum UpdateMethod {
  Push = 'push',
  Replace = 'replace',
  Go = 'go',
  GoBack = 'goBack',
  GoForward = 'goForward',
}

const callHistoryMethod = actionCreator<{
  method: UpdateMethod,
  n?: number,
  location?: string,
  state?: any,
}>('CALL_HISTORY_METHOD');
export const push = (location: string, state?: any) =>
  callHistoryMethod.call(null, { location, state, method: UpdateMethod.Push });

export const replace = (location: string, state?: any) =>
  callHistoryMethod.call(null, { location, state, method: UpdateMethod.Replace });

export const go = (n: number) =>
  callHistoryMethod.call(null, { n, method: UpdateMethod.Replace });

export const goBack = () => callHistoryMethod({ method: UpdateMethod.GoBack });

export const goForward = () => callHistoryMethod({ method: UpdateMethod.GoForward });

export function* routerSaga(history: History): SagaIterator {
  while (true) {
    const { method, payload } = yield take(callHistoryMethod.type);
    switch (method) {
      case UpdateMethod.Push:
        yield call(history.push, payload.location, payload.state);
        break;
      case UpdateMethod.Replace:
        yield call(history.replace, payload.location, payload.state);
        break;
      case UpdateMethod.Go:
        yield call(history.go, payload.n);
        break;
      case UpdateMethod.GoBack:
        yield call(history.goBack);
        break;
      case UpdateMethod.GoForward:
        yield call(history.goForward);
        break;
      default:
        break;
    }
  }
}

const routerReducer = (state: Router = null, action: IAnyAction): Router => {
  if (isType(action, locationChange)) {
    return action.payload;
  }

  return state;
};

export default routerReducer;
