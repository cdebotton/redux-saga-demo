import { rem } from 'polished';
import styled from 'styled-components';

const Button = styled.button`
  margin: ${rem(20)} 0 0 auto;
  border-radius: 3px;
  background-color: transparent;
  border: 2px solid #fff;
  color: #fff;
  cursor: pointer;
  font-weight: 800;
  text-transform: uppercase;
  font-size: ${rem(12)};
  padding: ${rem(6)} ${rem(12)};
  transition: all 175ms ease-in-out;

  &:focus,
  &:active {
    outline: none;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

export default Button;
