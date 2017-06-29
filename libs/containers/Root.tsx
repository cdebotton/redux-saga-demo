import { normalize } from 'polished';
import * as React from 'react';
import { Route, Switch } from 'react-router';
import { injectGlobal } from 'styled-components';
import Application from '../components/atoms/Application';
import Docs from '../pages/Docs';
import Login from '../pages/Login';

injectGlobal`
  ${normalize()}

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;

const Root = () => (
  <Application>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/docs" component={Docs} />
    </Switch>
  </Application>
);

export default Root;
