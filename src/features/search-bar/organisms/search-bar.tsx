import styled from 'styled-components';
import React, { useEffect } from 'react';
import { Button, ContentCenteredTemplate, IconLogo } from '@box/shared/ui';
import { Link } from 'react-router-dom';
import { SessionPanel, ShowOnly } from '@box/entities/session';
import { paths } from '@box/pages/paths';
import { theme } from '@box/shared/lib/theme';
import { useEvent } from 'effector-react/ssr';

import * as model from '../models';
import { Search } from '../molecules';
import { useSearchQuery } from '../lib';

export const Searchbar: React.FC = () => {
  useSearchQueryChanged();

  return (
    <Container>
      <ContentCenteredTemplate>
        <Nav>
          <Link to={paths.home()}>
            <IconLogo />
          </Link>
          <SearchWrapper>
            <Search />
          </SearchWrapper>
          <ShowOnly when="authorized">
            <NewCardLink to={paths.cardCreate()}>
              <Button theme="primary" variant="outlined" accented>
                Create card
              </Button>
            </NewCardLink>
          </ShowOnly>
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

const NewCardLink = styled(Link)`
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  text-decoration: none;

  button {
    color: var(${theme.palette.wizard});
  }
`;
