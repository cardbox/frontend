import styled from 'styled-components';
import React, { useEffect } from 'react';
import { CardList } from '@box/entities/card';
import { ContentCenteredTemplate, Text, TextType } from '@box/ui';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { UserPreviewList } from '@box/entities/user';
import { historyReplace } from '@box/entities/navigation';
import { reflect } from '@effector/reflect/ssr';
import { useEvent } from 'effector-react/ssr';
import { useSearchQuery } from '@box/features/search-bar';

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
    <ContentCenteredTemplate>
      <SearchTitle />
      <SearchTabs />
    </ContentCenteredTemplate>
  );
};

const SearchTitle = () => {
  const query = useSearchQuery();
  return (
    <SearchTitleStyled type={TextType.header3}>
      Search for "{query}"
    </SearchTitleStyled>
  );
};

const SearchTitleStyled = styled(Text)`
  margin-bottom: 2rem;
`;

const SearchTabs = () => {
  return (
    <Tabs>
      <TabListStyled>
        <TabStyled>
          <Text type={TextType.header6}>Cards</Text>
        </TabStyled>
        <TabStyled>
          <Text type={TextType.header6}>Users</Text>
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

  color: #9b99ac;
  transition: color 0.5s;
  &:hover {
    color: #4e4d56;
  }
  &.react-tabs__tab--selected {
    color: #000;
  }
`;
const CardResults = reflect({
  view: CardList,
  bind: {
    cards: model.$searchResultCardList,
    getHref: (card) => `/card/${card.id}`,
    loading: model.$isShowLoading,
  },
});

const UserResults = reflect({
  view: UserPreviewList,
  bind: {
    users: model.$searchResultUserList,
    loading: model.$isShowLoading,
  },
});
