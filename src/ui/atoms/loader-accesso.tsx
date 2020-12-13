import React from 'react';
import styled, { keyframes } from 'styled-components';

export const LoaderAccesso: React.FC = ({ children }) => (
  <Container>
    <Loader>
      <span />
      <span />
      <span />
    </Loader>
    <Filler>{children}</Filler>
  </Container>
);

const rotate = keyframes`
  0%, 100% {
    transform: translateX(0%) translateY(-100%);
  }
  33% {
    transform: translateX(100%) translateY(100%);
  }
  66% {
    transform: translateX(-100%) translateY(100%);
  }
`;

const Container = styled.div`
  display: flex;
  position: relative;
  height: 30px;
  position: relative;
`;

const Filler = styled.figure`
  margin: 0;
  padding: 0;
  display: inline-block;
  visibility: hidden;
  user-select: none;
`;

const Loader = styled.div`
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  & > span {
    display: inline-block;
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    animation: ${rotate} 1500ms ease-in-out infinite;
    will-change: transform, left, top;
  }

  *:nth-child(1) {
    transform: translateX(0%) translateY(-100%);
    background-color: var(--loader-color, black);
  }

  *:nth-child(2) {
    background: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 2px,
      var(--loader-color, black) 2px,
      var(--loader-color, black) 4px
    );
    animation-delay: -500ms;
    transform: translateX(100%) translateY(100%);
  }

  *:nth-child(3) {
    animation-delay: -1000ms;
    box-shadow: inset 0 0 0 2px var(--loader-color, black);
    transform: translateX(-100%) translateY(100%);
  }
`;
