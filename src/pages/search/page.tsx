import { reflect } from '@effector/reflect/ssr';
import { useEvent, useStore } from 'effector-react/scope';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import styled from 'styled-components';

import { searchModel, useSearchQuery } from '@box/features/search-bar';

import { CardList } from '@box/entities/card';
import { historyReplace } from '@box/entities/navigation';
import { userModel, UserPreviewList } from '@box/entities/user';

import { theme } from '@box/shared/lib/theme';
import { ContentCenteredTemplate, Text } from '@box/shared/ui';

import * as model from './model';
import { paths } from '../paths';

export const SearchPage = () => {
  const searchQueryChanged = useEvent(model.searchQueryChanged);
  const searchQuery = useSearchQuery();

  useEffect(() => {
    searchQueryChanged();
  }, [searchQuery, searchQueryChanged]);

  useEffect(() => {
    if (searchQuery === '') historyReplace(paths.home());
  }, [searchQuery]);

  return (
    <>
      <Helmet title={`Search · ${searchQuery}`} />
      <ContentCenteredTemplate>
        <SearchTitle />
        <SearchTabs />
      </ContentCenteredTemplate>
    </>
  );
};

const SearchTitle = () => {
  const query = useSearchQuery();
  return <SearchTitleStyled type="h3">Search for "{query}"</SearchTitleStyled>;
};

const SearchTitleStyled = styled(Text)`
  margin-bottom: 2rem;
`;

const SearchTabs = () => {
  return (
    <Tabs>
      <TabListStyled>
        <TabStyled>
          <Text type="h6">Cards</Text>
        </TabStyled>
        <TabStyled>
          <Text type="h6">Users</Text>
        </TabStyled>
      </TabListStyled>

      <TabPanel>
        <CardResults />
      </TabPanel>
      <TabPanel>
        <UserResults />
      </TabPanel>
    </Tabs>
  );
};
const TabListStyled = styled(TabList)`
  list-style: none;
  margin: 0;
  display: flex;
  padding: 0 0 1rem;
  align-items: center;
`;
const TabStyled = styled(Tab)`
  cursor: default;

  &:not(:last-child) {
    margin-right: 1rem;
  }

  color: var(${theme.palette.bnw600});
  transition: color 0.5s;

  &:hover {
    // todo: define colors for hover and others effects
    color: #4e4d56;
  }

  &.react-tabs__tab--selected {
    color: var(${theme.palette.bnw0});
  }
`;

const CardResults = () => {
  const usersMap = useStore(userModel.$usersMap);
  const cards = useStore(searchModel.$cardList);
  const isLoading = useStore(model.$isShowLoading);

  return <CardList cards={cards} loading={isLoading} />;
};

const UserResults = reflect({
  view: UserPreviewList,
  bind: {
    users: searchModel.$userList,
    loading: model.$isShowLoading,
    getUserHref: (user) => paths.user(user.username),
    // FIXME: implement later getCardsCount (if 'll be needed)
  },
});
