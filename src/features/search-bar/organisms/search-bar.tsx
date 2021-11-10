import styled from 'styled-components';
import React, { useEffect } from 'react';
import { Button, CardboxLogo, ContentCenteredTemplate } from '@box/shared/ui';
import { Link } from 'react-router-dom';
import { SessionPanel, ShowOnly } from '@box/entities/session';
import { breakpoints } from '@box/shared/lib/breakpoints';
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
            <CardboxLogo />
          </Link>
          <SearchWrapper>
            <Search />
          </SearchWrapper>
          <ButtonsWrapper>
            <ShowOnly when="authorized">
              <NewCardLink to={paths.cardCreate()}>
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

const Logo = styled(Link)`
  font-weight: 600;
  font-size: 30px;
  line-height: 37.35px;
  text-decoration: none;
  color: var(${theme.palette.bnw0});

  ${breakpoints.devices.mobile} {
    font-size: 26px;
  }

  @media screen and (max-width: 310px) {
    // Galaxy Fold front
    font-size: 18px;
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
