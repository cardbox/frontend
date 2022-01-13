import React from 'react';
import styled from 'styled-components';

import { reflect } from '@effector/reflect/scope';

import { Input } from '@box/shared/ui';

import * as model from '../models';

export const Search = () => {
  return (
    <Container>
      <SearchInput />
      {/* todo: implement in v1 */}
      {/*<button.Text>Advanced</button.Text>*/}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 42px;
`;

const SearchInput = reflect({
  view: Input,
  bind: {
    placeholder: 'Search...',
    value: model.$searchValue,
    onChange: model.searchFieldChanged,
  },
});
