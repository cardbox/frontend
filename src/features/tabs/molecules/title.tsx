import * as React from 'react';
import styled from 'styled-components';
import { button } from '@cardbox/ui';

interface TitleProps {
  title: string;
  index: number;
  setSelectedTab: (index: number) => void;
  active: number;
}

const TabTitle: React.FC<TitleProps> = ({
  title,
  active,
  index,
  setSelectedTab,
}) => {
  const onClick = React.useCallback(() => {
    setSelectedTab(index);
  }, [setSelectedTab, index]);
  return (
    <Button active={index === active} onClick={onClick}>
      {title}
    </Button>
  );
};

const Button = styled(button.Text)<{ active?: boolean }>`
  font-size: 1.125rem;
  line-height: 1.375rem;
  color: ${({ active }) => (active ? '#000000' : '#A39BB2')};
  padding: 0;
  margin-right: 1.875rem;
  & > *:last-child {
    margin-right: 0;
  }
`;

export { TabTitle };
