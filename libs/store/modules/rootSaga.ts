import { History } from 'history';
import { SagaIterator } from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import { routerSaga } from './router';

export interface ISagaContext {
  history: History;
}

export default function* rootSaga({ history }: ISagaContext): SagaIterator {
  yield all([
    fork(routerSaga, history),
  ]);
}
