import { placeholder, rem } from 'polished';
import styled, { css } from 'styled-components';

export enum InputSize {
  Large = 0,
  Medium = 1,
  Small = 2,
}

interface IProps {
  size?: InputSize;
}

const getSize = (size: InputSize): string => {
  switch (size) {
    case InputSize.Large:
      return '100%';
    case InputSize.Medium:
      return '50%';
    case InputSize.Small:
    default:
      return '25%';
  }
};

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

  flex: 0 0 calc(${(props: IProps) => getSize(props.size)} - ${rem(10)});

`;

Input.defaultProps = {
  size: InputSize.Medium,
};

export default Input;
