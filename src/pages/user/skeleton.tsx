import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import {
  Avatar,
  ContentCenteredTemplate,
  Skeleton,
  button,
  iconUserBg,
} from '@box/ui';
import { CardPreview } from '@box/entities/card';
import { theme } from '@box/lib/theme';
import { withStart } from '@box/lib/page-routing';

import * as model from './model';

export const SkeletonLayout = () => {
  return (
    <>
      <UnderLay bg={iconUserBg} />
      <ContentCenteredTemplate>
        <Container>
          <UserHeader>
            <UserFace>
              <UserFaceContent>
                <UserFaceNameSkeleton />
                <UserDescriptionSkeleton>
                  <UserFacePositionSkeleton />
                </UserDescriptionSkeleton>
                <UserFaceDescriptionSkeleton />
              </UserFaceContent>
            </UserFace>
            <UserSocial>
              <SocialStaff>
                <SocialStaffList>
                  <SocialStaffItem>
                    <AvatarSkeleton size="small" />
                    <SocialStaffItemText />
                  </SocialStaffItem>
                  <SocialStaffItem>
                    <AvatarSkeleton size="small" />
                    <SocialStaffItemText />
                  </SocialStaffItem>
                </SocialStaffList>
              </SocialStaff>
            </UserSocial>
            <UserLogo>
              <StAvatar size="large" />
            </UserLogo>
            <EditProfile>
              <ButtonText />
            </EditProfile>
          </UserHeader>
          <Main>
            <UserCards>
              <CardListContainer>
                <Skeleton />
                <Skeleton />
              </CardListContainer>
            </UserCards>
          </Main>
        </Container>
      </ContentCenteredTemplate>
    </>
  );
};

withStart(model.pageLoaded, SkeletonLayout);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 2;
  margin-top: -6.25rem;
`;

const UserHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: var(${theme.palette.bnw0});

  border: 1px solid var(${theme.palette.bnw200});
  box-shadow: ${theme.shadows[2]};
  border-radius: 6px;
  padding: 1.5rem 1.875rem;
  position: relative;
  & > *:not(:first-child) {
    align-self: start;
    justify-self: flex-end;
  }
`;

const UnderLay = styled.div<{ bg?: string }>`
  background: ${({ bg }) =>
    bg &&
    `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%), url("${bg}") no-repeat center`};
  background-size: cover;
  width: 100%;
  height: 8.75rem;
  margin-top: -1.875rem;
  z-index: 1;
`;

const UserFace = styled.div`
  display: flex;
  align-items: flex-start;

  & > *:first-child {
    margin-right: 1.5rem;
  }
`;

const UserFaceContent = styled.div`
  & > *:first-child {
    margin-bottom: 0.375rem;
  }
`;

const shine = keyframes`
  to {
    background-position: 100% 0;
  }
`;

const bgColorSkeleton = css`
  background: var(${theme.palette.gray100});
  box-sizing: border-box;
  border: 1px solid var(${theme.palette.bnw200});
  box-shadow: ${theme.shadows[1]};
  opacity: 0.9;
  animation: blink 4s infinite ease;

  @keyframes blink {
    0% {
      opacity: 0.4;
    }
    25% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
    75% {
      opacity: 0.7;
    }
    90% {
      opacity: 0.4;
    }
  }

  // animation: ${shine} 1s infinite;
`;

const UserFaceNameSkeleton = styled.div`
  width: 238px;
  height: 50px;
  display: block;
  ${bgColorSkeleton}
`;

const UserFacePositionSkeleton = styled.div`
  width: 100%;
  height: 24px;
  display: block;
  ${bgColorSkeleton}
`;

const UserDescriptionSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 250px;
  height: 56px;
  margin-top: 0.375rem;
`;

const UserFaceDescriptionSkeleton = styled.div`
  width: 250px;
  height: 30px;
  margin-top: 1rem;
  ${bgColorSkeleton}
`;

const UserSocial = styled.div``;

const SocialStaff = styled.div`
  & > *:first-child {
    margin-bottom: 1.125rem;
  }
`;

const SocialStaffList = styled.div`
  display: flex;
  flex-direction: column;

  & > *:not(:last-child) {
    margin-bottom: 0.9375rem;
  }
`;

const SocialStaffItem = styled.div`
  align-items: center;
  display: flex;

  & > *:first-child {
    margin-right: 12px;
  }
`;

const SocialStaffItemText = styled.div`
  width: 120px;
  height: 24px;
  ${bgColorSkeleton}
`;

const StAvatar = styled(Avatar)`
  border: 1px solid var(${theme.palette.bnw200});
  border-radius: 3px;
  ${bgColorSkeleton}
`;

const UserLogo = styled.div``;

const AvatarSkeleton = styled(Avatar)`
  transform: rotate(180deg);
  ${bgColorSkeleton}
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;

  & > *:last-child {
    margin-top: 6.25rem;
  }
`;

const UserCards = styled.div`
  margin-bottom: 8.25rem;
`;

const CardListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 1.125rem;

  & > *:not(:last-child) {
    margin-bottom: 1.125rem;
  }
`;

const EditProfile = styled(button.Outline)`
  position: absolute;
  display: flex;
  align-items: center;
  right: 1.875rem;
  bottom: 1.5rem;
  ${bgColorSkeleton};
  width: 160px;
`;

const ButtonText = styled.span``;
