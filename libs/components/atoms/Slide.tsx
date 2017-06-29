import { rem } from 'polished';
import * as React from 'react';
import styled from 'styled-components';

interface IProps {
  children?: any;
}

const Slide = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-content: stretch;
  margin: 0 ${rem(20)};
  align-self: stretch;
  width: 100%;
  background-color: #fff;
`;

export default Slide;
