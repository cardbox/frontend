import React from 'react';
import styled from 'styled-components';
import { IconUserLogoDefault, Text } from '@box/shared/ui';
import { SignInButton } from '@box/entities/session';

export const InvitePage = () => {
  return (
    <InvitePageWrapper>
      <IconWrapper>
        <IconUserLogoDefault /> <LogoText>cardbox</LogoText>
      </IconWrapper>
      <InviteText type="span">
        We make a service for convenient storage and search of our ideas and
        developments. Now it is at the stage of closed testing. You can join it
        by writing to{' '}
        <a href="https://t.me/joinchat/qbcXKo55seY4OThi" target="_blank">
          Telegram channel
        </a>
        . You can also write there if you want to help the service by hand.
      </InviteText>
      <SubText type="span">
        We will submit all your wishes for the service for general discussion
        and take them by priority to work.
      </SubText>
      <SignInButton variant="outlined" label="I have an invite" />
    </InvitePageWrapper>
  );
};

const InvitePageWrapper = styled.div`
  padding: 8rem;
  max-width: 800px;
`;
const IconWrapper = styled.div`
  & svg {
    width: 20px;
    height: 20px;
    & rect {
      fill: #683aef;
    }
  }
`;

const LogoText = styled.span`
  font-size: 36px;
`;

const InviteText = styled(Text)`
  padding: 48px 0 24px;
  display: block;
`;

const SubText = styled(Text)`
  padding-bottom: 24px;
  display: block;
`;
