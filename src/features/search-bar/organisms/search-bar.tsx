import { Link } from 'atomic-router-react';
import { useEvent } from 'effector-react/scope';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { SessionPanel, ShowOnly } from '@box/entities/session';

import { breakpoints } from '@box/shared/lib/breakpoints';
import { theme } from '@box/shared/lib/theme';
import { routes } from '@box/shared/routes';
import { Button, CardboxLogo, ContentCenteredTemplate } from '@box/shared/ui';

import * as model from '../models';
import { useSearchQuery } from '../lib';
import { Search } from '../molecules';

export const Searchbar: React.FC = () => {
  useSearchQueryChanged();

  return (
    <Container>
      <ContentCenteredTemplate>
        <Nav>
          <Link to={routes.home}>
            <CardboxLogo />
          </Link>
          <SearchWrapper>
            <Search />
          </SearchWrapper>
          <ButtonsWrapper>
            <ShowOnly when="authorized">
              <NewCardLink to={routes.card.create}>
                <Button theme="primary" variant="outlined" accented>
                  Create card
                </Button>
              </NewCardLink>
            </ShowOnly>
            <SessionPanel />
          </ButtonsWrapper>
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

  ${breakpoints.devices.mobile} {
    height: auto;
    flex-wrap: wrap;
    padding: 12px 0;
  }
`;

const SearchWrapper = styled.div`
  flex-grow: 1;
  order: 1;
  margin-left: 3.125rem;
  margin-right: 1.125rem;

  @media screen and (max-width: 623px) {
    order: 2;
    width: 100%;
    margin: 12px 0 0;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  order: 2;

  @media screen and (max-width: 623px) {
    order: 1;
    margin-left: auto;
    justify-content: space-between;
    width: 100%;
  }
`;

const NewCardLink = styled(Link)`
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  text-decoration: none;

  button {
    color: var(${theme.palette.wizard});
  }

  ${breakpoints.devices.mobile} {
    margin-left: 0;
  }
`;
