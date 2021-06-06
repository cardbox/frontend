import React from 'react';
import styled from 'styled-components';
import { CardList } from '@cardbox/entities/card';
import { UserPreviewList } from '@cardbox/entities/user';
import { useEvent, useStore } from 'effector-react/ssr';
import { useHistory } from 'react-router';
import { useSearchQuery } from '@cardbox/features/search-bar';

import * as model from './model';
import { ContentCenteredTemplate } from '../../ui';
import { getSEnd } from '../../lib/get-s-end';
import { paths } from '../paths';

export const SearchPage = () => {
  const searchQueryChanged = useEvent(model.searchQueryChanged);
  const isShowLoading = useStore(model.$isShowLoading);
  const searchQuery = useSearchQuery();
  const history = useHistory();

  React.useEffect(() => {
    searchQueryChanged();
  }, [searchQuery, searchQueryChanged]);

  React.useEffect(() => {
    if (searchQuery === '') history.replace(paths.home());
  }, [history, searchQuery]);

  if (isShowLoading) {
    return (
      <ContentCenteredTemplate>
        <p>Loading...</p>
      </ContentCenteredTemplate>
    );
  }
  return (
    <ContentCenteredTemplate>
      <Container>
        <CardRes />
        <UserRes />
      </Container>
    </ContentCenteredTemplate>
  );
};

const CardRes = () => (
  <SearchResultsCount count={useStore(model.$searchCardsCount)} entity="cards">
    <CardList cards={useStore(model.$searchResultCardList)} />
  </SearchResultsCount>
);

const UserRes = () => (
  <SearchResultsCount count={useStore(model.$searchUsersCount)} entity="users">
    <UserPreviewList users={useStore(model.$searchResultUserList)} />
  </SearchResultsCount>
);
interface SearchResultsCountProps {
  count: number;
  entity: 'users' | 'cards' | string;
}
const SearchResultsCount: React.FC<SearchResultsCountProps> = ({
  count,
  children,
  entity,
}) => (
  <SearchResultsCountWrapper>
    <SearchResultsCountTitle>
      {entity} ({count} result{getSEnd(count)})
    </SearchResultsCountTitle>
    {children}
  </SearchResultsCountWrapper>
);
const SearchResultsCountWrapper = styled.div`
  overflow: hidden;
`;

const SearchResultsCountTitle = styled.p`
  font-size: 0.75rem;
  text-transform: capitalize;
  margin: 0 0 1.5rem;
  font-weight: 400;
  line-height: 0.95rem;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-gap: 2rem;
`;
