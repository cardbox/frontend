import React from 'react';
import styled from 'styled-components';
import { Avatar, ContentCenteredTemplate, IconLogo, button } from '@cardbox/ui';
import { Link } from 'react-router-dom';
import { useEvent } from 'effector-react/ssr';

import * as model from '../models';
import { Search } from '../molecules';
import { paths } from '../../../pages/paths';
import { useSearchQuery } from '../lib';

export const Searchbar = () => {
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
          <LoginBlock>
            <Avatar />
          </LoginBlock>
          <button.Base>New card</button.Base>
        </Nav>
      </ContentCenteredTemplate>
    </Container>
  );
};

function useSearchQueryChanged() {
  const query = useSearchQuery();
  const searchValueChanged = useEvent(model.searchValueChanged);

  React.useEffect(() => {
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
