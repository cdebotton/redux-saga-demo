import { normalize } from 'polished';
import * as React from 'react';
import { injectGlobal } from 'styled-components';

injectGlobal`
  ${normalize()}
`;

const Root = () => (
  <div>
    <h1>Hello, world!</h1>
  </div>
);

export default Root;
