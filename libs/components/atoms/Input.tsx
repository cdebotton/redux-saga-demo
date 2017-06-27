import { placeholder, rem } from 'polished';
import styled, { css } from 'styled-components';

export enum InputSize {
  Medium,
}

interface IProps {
  size?: InputSize;
}

const Input = styled.input`
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #fff;
  color: #fff;
  outline: none;
  padding: ${rem(6)} ${rem(12)};

  ${placeholder({
    color: '#fff',
  })}

  ${(props: IProps) => props.size === InputSize.Medium && css`
    flex: 0 0 50%;
  `}
`;

Input.defaultProps = {
  size: InputSize.Medium,
};

export default Input;
