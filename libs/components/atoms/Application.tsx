import { rem } from 'polished';
import styled, { keyframes } from 'styled-components';

const drift = keyframes`
	from {
		background-position: 0 0;
	}

	to {
		background-position: -300vw -300vh;
	}
`;

const Application = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  min-height: 100vh;
  padding: ${rem(20)} 0;
	background-size: 400vw 400vh;
  background-image:
    linear-gradient(
      to bottom right,
      hsla(255, 50%, 50%, 1),
      hsla(240, 50%, 50%, 1),
      hsla(225, 50%, 50%, 1),
      hsla(210, 50%, 50%, 1),
      hsla(195, 50%, 50%, 1)
    );
	animation: ${drift} 30s linear alternate infinite;
`;

export default Application;
