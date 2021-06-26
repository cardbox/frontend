import React from 'react';
import styled from 'styled-components';

export const Skeleton: React.FC = ({ children }) => {
  return <Root>{children}</Root>;
};

interface SkeletonGroupProps {
  amount: number;
}
export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({ amount }) => (
  <Group>
    {new Array(amount).fill(null).map((_, i) => (
      <Skeleton key={i} />
    ))}
  </Group>
);

const Root = styled.article`
  height: 220px;
  background: var(--gray100);
  border: 1px solid #eeeef1;
  box-sizing: border-box;
  box-shadow: 0px 3px 9px #fbfafb;
  border-radius: 6px;
  opacity: 0.5;
  animation: blink 2s infinite ease;

  @keyframes blink {
    0% {
      opacity: 0.4;
    }
    25% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
    75% {
      opacity: 0.7;
    }
    90% {
      opacity: 0.4;
    }
  }
`;

const Group = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1.5rem;
  flex-direction: column;
  width: 100%;
`;
