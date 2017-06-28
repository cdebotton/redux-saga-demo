import { History } from 'history';
import { SagaIterator } from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import { ISessionService } from '../../utils/SessionService';
import { routerSaga } from './router';
import { sessionSaga } from './session';

export interface ISagaContext {
  history: History;
  session: ISessionService;
}

export default function* rootSaga({ history, session }: ISagaContext): SagaIterator {
  yield all([
    fork(routerSaga, history),
    fork(sessionSaga, session),
  ]);
}
