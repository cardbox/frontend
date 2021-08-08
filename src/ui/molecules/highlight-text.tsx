import React from 'react';
import styled from 'styled-components';

interface HighlightTextProps {
  isFound: boolean;
  text: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({
  isFound,
  text,
}) => {
  return <PartText data-is-selected={isFound}>{text}</PartText>;
};

const PartText = styled.span<{ 'data-is-selected': boolean }>`
  &[data-is-selected='true'] {
    color: blue;
  }
`;
