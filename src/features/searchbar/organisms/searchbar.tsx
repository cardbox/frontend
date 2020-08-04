import React from 'react';
import styled from 'styled-components';
import { ContentCenteredTemplate, IconLogo, button } from 'ui';
import { LoginButton } from 'features/oauth';

import { Search } from '../molecules';

export const Searchbar = () => {
  return (
    <Container>
      <ContentCenteredTemplate>
        <Nav>
          <img src={IconLogo} alt="Logo" />
          <SearchWrapper>
            <Search />
          </SearchWrapper>
          <LoginBlock>
            {/* <Avatar /> */}
            <LoginButton />
          </LoginBlock>
          <button.Base>New card</button.Base>
        </Nav>
      </ContentCenteredTemplate>
    </Container>
  );
};

const Container = styled.header`
  background-color: #fff;
  box-shadow: 0px 6px 9px #f6f5f8;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  position: relative;
`;

const Nav = styled.nav`
  align-items: center;
  display: flex;
  height: 72px;
`;

const SearchWrapper = styled.div`
  flex-grow: 1;
  margin-left: 3.125rem;
`;

const LoginBlock = styled.div`
  margin: 0 1.125rem;
`;

export const Avatar = styled.div`
  background-color: #f4f2f7;
  border-radius: 3px;
  height: 42px;
  width: 42px;
`;
