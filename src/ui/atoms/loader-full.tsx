import styled, { keyframes } from 'styled-components';

const spinForward = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const spinBackward = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
`;

export const LoaderFull = styled.div`
  --loader-first: #000;
  --loader-second: #000;
  --loader-third: #000;

  display: block;
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: var(--loader-first, #16a085);
  animation: ${spinForward} 2s linear infinite;
  z-index: 11;

  &:before {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: var(--loader-second, #e74c3c);
    animation: ${spinBackward} 1s linear infinite;
  }

  &:after {
    content: '';
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: var(--loader-third, #f9c922);
    animation: ${spinForward} 4s linear infinite;
  }
`;
