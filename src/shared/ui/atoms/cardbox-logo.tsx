import React from 'react';
import styled from 'styled-components';

import { IconCardboxLogo, IconUserLogoDefault } from '@box/shared/ui';

export function CardboxLogo() {
  return (
    <IconWrapper>
      <IconUserLogoDefault data-icon="square" />
      <IconCardboxLogo data-icon="text" />
    </IconWrapper>
  );
}

const IconWrapper = styled.div`
  display: flex;
  align-items: baseline;

  [data-icon='text'] {
    height: 24px;
    margin-left: 10px;
  }

  [data-icon='square'] {
    height: 17px;
    width: 17px;
    border-radius: 3px;
    & rect {
      fill: #683aef;
    }
  }
`;
