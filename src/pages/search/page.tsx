import { reflect } from '@effector/reflect/scope';
import { createEvent, createStore } from 'effector';
import { useUnit } from 'effector-react/scope';
import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import { CardList } from '@box/entities/card';
import { UserPreviewList } from '@box/entities/user';

import { Card, User } from '@box/shared/api';
import { ContentCenteredTemplate } from '@box/shared/ui';

import { TabName } from './types';

export const tabChanged = createEvent<TabName>();

export const $searchQuery = createStore('');
export const $currentTab = createStore<TabName>('cards');
export const $isShowLoading = createStore(false);
export const $cardList = createStore<Card[]>([]);
export const $userList = createStore<User[]>([]);

export const SearchPage = () => {
  const data = useUnit({ searchQuery: $searchQuery });

  return (
    <>
      <Helmet title={`Search · ${data.searchQuery}`} />
      <ContentCenteredTemplate>
        <SearchTitle />
        <SearchTabs />
      </ContentCenteredTemplate>
    </>
  );
};

const SearchTitle = () => {
  const query = useUnit($searchQuery);
  if (query.trim().length === 0) {
    return <h3 className="text-5xl py-8">Enter search query</h3>;
  }
  return <h3 className="text-5xl py-8">Search for "{query}"</h3>;
};

const SearchTabs = () => {
  const [tab, changeTab] = useUnit([$currentTab, tabChanged]);
  const indexes = {
    cards: 0,
    users: 1,
  };
  const names = {
    0: 'cards',
    1: 'users',
  };
  const handleChange = useCallback(
    (index: number) => {
      changeTab(names[index]);
    },
    [changeTab],
  );
  return (
    <Tabs
      selectedIndex={indexes[tab]}
      onSelect={handleChange}
      selectedTabClassName="box-selected-tab"
    >
      <TabList className="box-tab-list mb-10">
        <Tab className="box-tab">Cards</Tab>
        <Tab className="box-tab">Users</Tab>
      </TabList>

      <TabPanel>
        <CardResults />
      </TabPanel>
      <TabPanel>
        <UserResults />
      </TabPanel>
    </Tabs>
  );
};

const CardResults = reflect({
  view: CardList,
  bind: {
    cards: $cardList,
    loading: $isShowLoading,
  },
});

const UserResults = reflect({
  view: UserPreviewList,
  bind: {
    users: $userList,
    loading: $isShowLoading,
  },
});
