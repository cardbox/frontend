import React from 'react';
import styled from 'styled-components';
import { ContentCentered, IconLogo, button } from 'ui';

import { Search } from '../molecules';

export const Searchbar = () => {
  return (
    <Container>
      <ContentCentered>
        <Nav>
          <img src={IconLogo} alt="Logo" />
          <SearchWrapper>
            <Search />
          </SearchWrapper>
          <Avatar />
          <button.Base>New card</button.Base>
        </Nav>
      </ContentCentered>
    </Container>
  );
};

const Container = styled.header`
  background-color: #fff;
  box-shadow: 0px 6px 9px #f6f5f8;
  display: flex;
  flex-shrink: 0;
  height: 72px;
  justify-content: center;
  position: relative;
`;

const Nav = styled.nav`
  align-items: center;
  display: flex;
`;

const SearchWrapper = styled.div`
  flex-grow: 1;
  margin-left: 3.125rem;
`;

export const Avatar = styled.div`
  background-color: #f4f2f7;
  border-radius: 3px;
  height: 42px;
  margin: 1.125rem;
  width: 42px;
`;
