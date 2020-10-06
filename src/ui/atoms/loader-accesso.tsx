import React from 'react';
import styled, { keyframes } from 'styled-components';

export const LoaderAccesso = () => (
  <Loader>
    <span />
    <span />
    <span />
  </Loader>
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

const Loader = styled.div`
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 28px;
  position: relative;

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
