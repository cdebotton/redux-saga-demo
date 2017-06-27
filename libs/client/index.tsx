import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from '../store';

const mount = document.querySelector('#app');
const store = configureStore();

const render = () => {
  const Root = require('../containers/Root').default;
  ReactDOM.render(
    <Provider store={store}>
      <Root />
    </Provider>,
    mount,
  );
};

render();

if (module.hot) {
  module.hot.accept('../containers/Root', render);
}
