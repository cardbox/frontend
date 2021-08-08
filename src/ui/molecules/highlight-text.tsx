import styled from 'styled-components';
import React, { Fragment } from 'react';
import { getFoundData } from '@box/entities/user/lib';

interface HighlightTextProps {
  query: string;
  text: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({
  query,
  text,
}) => {
  const data = getFoundData({ search: text, query });
  if (query === '') {
    return <Fragment>{text}</Fragment>;
  }
  return (
    <>
      {data.map(({ isFound, segment }, index) => (
        // eslint-disable-next-line react/jsx-key,react/no-array-index-key
        <PartText key={index} data-is-selected={isFound}>
          {segment}
        </PartText>
      ))}
    </>
  );
};

const PartText = styled.span<{ 'data-is-selected': boolean }>`
  &[data-is-selected='true'] {
    color: blue;
  }
`;
