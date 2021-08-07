import React, { FC } from 'react';
import styled from 'styled-components';
import { Text, TextType, iconEmpty } from '@box/ui';

interface EmptySearchProps {
  text: string;
}

export const EmptySearch: FC<EmptySearchProps> = ({
  text
}) => {
  return (
    <EmptyBlock>
      <EmptyIcon src={iconEmpty} />
      <Text type={TextType.primary}>{text}</Text>
    </EmptyBlock>
  );
};

const EmptyBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmptyIcon = styled.img<{ margin?: string }>`
  margin: ${({ margin }) => margin || 0};
`;
