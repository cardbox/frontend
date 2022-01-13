import React, { useCallback } from 'react';
import styled from 'styled-components';

import { theme } from '@box/shared/lib/theme';

import { Button } from '../../atoms';

interface TitleProps {
  title: string;
  index: number;
  setSelectedTab: (index: number) => void;
  active: number;
  isVisible?: boolean;
}

const TabTitle: React.FC<TitleProps> = ({
  title,
  active,
  index,
  setSelectedTab,
  isVisible = true,
}) => {
  const onClick = useCallback(() => {
    setSelectedTab(index);
  }, [setSelectedTab, index]);
  if (!isVisible) {
    return null;
  }
  return (
    <ButtonStyled variant="text" type="button" data-is-active={index === active} onClick={onClick}>
      {title}
    </ButtonStyled>
  );
};

const ButtonStyled = styled(Button)<{ 'data-is-active': boolean }>`
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
