import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware, { END } from 'redux-saga';
import rootReducer from './modules/rootReducer';
import { IState } from './state';

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const enhancer = composeWithDevTools(applyMiddleware(sagaMiddleware));
  const store = createStore<IState>(rootReducer, enhancer);

  if (module.hot) {
    module.hot.accept('./modules/rootReducer', () => {
      const nextRootReducer = require('./modules/rootReducer').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return {
    ...store,
    close: () => {
      store.dispatch(END);
    },
    run: sagaMiddleware.run,
  };
};

export default configureStore;
