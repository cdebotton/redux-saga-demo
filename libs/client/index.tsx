import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import ConnectedRouter from '../containers/ConnectedRouter';
import configureStore from '../store';
import rootSaga from '../store/modules/rootSaga';

const mount = document.querySelector('#app');
const history = createBrowserHistory();
const store = configureStore();
store.run(rootSaga, { history });

const render = () => {
  const Root = require('../containers/Root').default;
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Root />
      </ConnectedRouter>
    </Provider>,
    mount,
  );
};

render();

if (module.hot) {
  module.hot.accept('../containers/Root', render);
}
