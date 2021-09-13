import styled from 'styled-components';
import React, { useEffect } from 'react';
import { Button, ContentCenteredTemplate, IconLogo } from '@box/ui';
import { Link } from 'react-router-dom';
import { SessionPanel } from '@box/entities/session';
import { theme } from '@box/lib/theme';
import { useEvent } from 'effector-react/ssr';

import * as model from '../models';
import { Search } from '../molecules';
import { useSearchQuery } from '../lib';

interface SearchbarProps {
  logoHref: string;
  viewerHref: string;
  newCardHref: string;
}

// TODO: вынести из Searchbar логику с пользователем
export const Searchbar: React.FC<SearchbarProps> = ({
  logoHref,
  newCardHref,
}) => {
  useSearchQueryChanged();

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
          <SessionPanel />
          <NewCardLink to={newCardHref}>
            <Button theme="primary" variant="outlined" accented>
              New card
            </Button>
          </NewCardLink>
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

const NewCardLink = styled(Link)`
  margin-left: 1.125rem;
  text-decoration: none;

  button {
    color: var(${theme.palette.wizard});
  }
`;
