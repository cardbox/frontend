import styled from 'styled-components';
import React, { useEffect } from 'react';
import { Avatar, ContentCenteredTemplate, IconLogo, button } from '@box/ui';
import { Link } from 'react-router-dom';
import { User } from '@box/api';
import { useEvent } from 'effector-react/ssr';

import * as model from '../models';
import { Search } from '../molecules';
import { paths } from '../../../pages/paths';
import { useSearchQuery } from '../lib';

interface SearchbarProps {
  user: User;
}

export const Searchbar = ({ user }: SearchbarProps) => {
  useSearchQueryChanged();

  return (
    <Container>
      <ContentCenteredTemplate>
        <Nav>
          <Link to={paths.home()}>
            <img src={IconLogo} alt="Logo" />
          </Link>
          <SearchWrapper>
            <Search />
          </SearchWrapper>
          <UserLink href={`/u/${user.username}`}>
            <LoginBlock>
              <Avatar src={user.avatar} />
            </LoginBlock>
          </UserLink>
          <button.Base>New card</button.Base>
        </Nav>
      </ContentCenteredTemplate>
    </Container>
  );
};

function useSearchQueryChanged() {
  const query = useSearchQuery();
  const searchValueChanged = useEvent(model.searchValueChanged);

  useEffect(() => {
    searchValueChanged(query);
  }, [query, searchValueChanged]);
}

const Container = styled.header`
  background-color: #fff;
  box-shadow: 0 6px 9px #f6f5f8;
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

const UserLink = styled.a`
  margin: 0 1.125rem;
`;
