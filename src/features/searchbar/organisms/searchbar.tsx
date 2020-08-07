import React from 'react';
import styled from 'styled-components';
import { Avatar, ContentCenteredTemplate, IconLogo, button } from 'ui';

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
            <Avatar />
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
