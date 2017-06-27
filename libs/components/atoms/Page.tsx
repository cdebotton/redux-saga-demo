import { rem } from 'polished';
import styled, { css } from 'styled-components';

interface IProps {
  centered?: boolean;
}

const Page = styled.div`
  display: flex;
  flex-flow: row wrap;
  max-width: ${rem(640)};
  margin: 0 auto;
  width: 100%;
  height: 100%;

  ${(props: IProps) => props.centered && css`
    align-items: center;
    justify-content: center;
  `}
`;

Page.defaultProps = {
  centered: false,
};

export default Page;
