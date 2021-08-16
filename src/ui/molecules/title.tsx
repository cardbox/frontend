import * as React from 'react';
import styled from 'styled-components';
import { button } from '@box/ui';
import { theme } from '@box/lib/theme';

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
    <Button type="button" data-is-active={index === active} onClick={onClick}>
      {title}
    </Button>
  );
};

const Button = styled(button.Text)<{ 'data-is-active'?: boolean }>`
  font-size: 1.125rem;
  line-height: 1.375rem;
  padding: 0;
  margin-right: 1.875rem;

  color: var(${theme.palette.bnw600});
  &[data-is-active='true'] {
    color: var(${theme.palette.bnw0});
  }

  & > *:last-child {
    margin-right: 0;
  }
`;

export { TabTitle };
