import styled from 'styled-components';
import React, { useEffect } from 'react';
import { $currentUser } from '@box/entities/user/model';
import { Avatar, Button, ContentCenteredTemplate, IconLogo } from '@box/ui';
import { Link } from 'react-router-dom';
import { SessionPanel } from '@box/entities/session';
import { imgLogo } from '@box/shared/assets';
import { paths } from '@box/pages/paths';
import { theme } from '@box/lib/theme';
import { useEvent, useStore } from 'effector-react/ssr';

import * as model from '../models';
import { Search } from '../molecules';
import { useSearchQuery } from '../lib';

interface SearchbarProps {
  logoHref: string;
  viewerHref: string;
  newCardHref: string;
}

export const Searchbar: React.FC<SearchbarProps> = ({
  logoHref,
  newCardHref,
}) => {
  useSearchQueryChanged();
  const viewer = useStore($currentUser);

  return (
    <Container>
      <ContentCenteredTemplate>
        <Nav>
          <Link to={logoHref}>
            <IconLogo />
          </Link>
          <SearchWrapper>
            <Search />
          </SearchWrapper>
          {viewer && (
            <User to={paths.user(viewer.username)}>
              <Avatar src={viewer.avatar || imgLogo} />
              <UserName>{viewer.username}</UserName>
            </User>
          )}
          <NewCardLink to={newCardHref}>
            <Button theme="primary" variant="outlined" accented>
              New card
            </Button>
          </NewCardLink>
          <SessionPanel />
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
  background-color: var(${theme.palette.bnw1000});
  border-bottom: 1px solid var(${theme.palette.bnw800});
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
  margin-right: 1.125rem;
`;

const User = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
`;

const UserName = styled.span`
  margin-right: 12px;
  margin-left: 8px;
`;

const NewCardLink = styled(Link)`
  margin-left: 1.125rem;
  text-decoration: none;

  button {
    color: var(${theme.palette.wizard});
  }
`;
