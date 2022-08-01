import React from 'react';
import styled from 'styled-components';

import { SignInButton } from '@box/entities/session';

import { Text } from '@box/shared/ui';
import { CardboxLogo } from '@box/shared/ui/atoms/cardbox-logo';

export const InvitePage = () => {
  return (
    <InvitePageWrapper>
      <CardboxLogo />
      <InviteText>
        We make a service for convenient storage and search of our ideas and developments. Now it is
        at the stage of closed testing. You can join it by writing to{' '}
        <a href="https://t.me/joinchat/qbcXKo55seY4OThi" target="_blank">
          telegram
        </a>
        . You can also write there if you want to help the service by hand.
      </InviteText>
      <SubText>
        We will submit all your wishes for the service for general discussion and take them by
        priority to work.
      </SubText>
      <SignInButton variant="outlined" label="I have an invite" />
    </InvitePageWrapper>
  );
};

const InvitePageWrapper = styled.div`
  padding: 8rem;
  max-width: 800px;
`;

const InviteText = styled(Text)`
  padding: 48px 0 24px;
  line-height: 24px;
  font-size: 18px;
  display: block;
`;

const SubText = styled(Text)`
  padding-bottom: 24px;
  line-height: 24px;
  font-size: 18px;
  display: block;
`;
