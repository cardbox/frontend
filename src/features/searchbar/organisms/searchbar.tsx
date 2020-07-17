import React from 'react';
import styled from 'styled-components';
import { IconLogo, button } from 'ui';

import { Search } from '../molecules';

export const Searchbar = () => {
  return (
    <Container>
      <Nav>
        <img src={IconLogo} alt="Logo" />
        <SearchWrapper>
          <Search />
        </SearchWrapper>
        <Avatar />
        <button.Base>New card</button.Base>
      </Nav>
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
  width: 1404px;
`;

const SearchWrapper = styled.div`
  flex-grow: 1;
  margin-left: 50px;
`;

export const Avatar = styled.div`
  background-color: #f4f2f7;
  border-radius: 3px;
  height: 42px;
  margin: 1.125rem;
  width: 42px;
`;
