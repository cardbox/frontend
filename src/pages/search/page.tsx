import styled from 'styled-components';
import React, { useEffect } from 'react';
import { CardList } from '@cardbox/entities/card';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { UserPreviewList } from '@cardbox/entities/user';
import { useEvent, useStore } from 'effector-react/ssr';
import { useHistory } from 'react-router';
import { useSearchQuery } from '@cardbox/features/search-bar';

import * as model from './model';
import { ContentCenteredTemplate, Text, TextType } from '../../ui';
import { paths } from '../paths';

export const SearchPage = () => {
  const searchQueryChanged = useEvent(model.searchQueryChanged);
  const isShowLoading = useStore(model.$isShowLoading);
  const searchQuery = useSearchQuery();
  const history = useHistory();

  useEffect(() => {
    searchQueryChanged();
  }, [searchQuery, searchQueryChanged]);

  useEffect(() => {
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
      <SearchTitle />
      <SearchTabs />
    </ContentCenteredTemplate>
  );
};

const SearchTitle = () => {
  const query = useSearchQuery();
  return (
    <SearchTitleStyled type={TextType.header1}>
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
        <CardRes />
      </TabPanel>
      <TabPanel>
        <UserRes />
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
const CardRes = () => {
  const cards = useStore(model.$searchResultCardList);
  return <CardList cards={cards} />;
};

const UserRes = () => {
  const users = useStore(model.$searchResultUserList);
  return <UserPreviewList users={users} />;
};
