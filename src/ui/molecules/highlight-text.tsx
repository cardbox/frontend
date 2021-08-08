import React from 'react';
import styled from 'styled-components';
import { getFoundData } from '@box/entities/user/lib';

interface HighlightTextProps {
  query: string;
  entity: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({
  query,
  entity,
}) => {
  const data = getFoundData({ search: entity, query });
  return (
    <>
      {data.map(({ isFound, text }, index) => (
        // eslint-disable-next-line react/jsx-key,react/no-array-index-key
        <PartText key={index} data-is-selected={isFound}>
          {text}
        </PartText>
      ))}
    </>
  );
  // ;
};

const PartText = styled.span<{ 'data-is-selected': boolean }>`
  &[data-is-selected='true'] {
    color: blue;
  }
`;
