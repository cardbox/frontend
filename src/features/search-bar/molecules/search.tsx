import React from 'react';
import styled from 'styled-components';
import { reflect } from '@effector/reflect/ssr';
import { theme } from '@box/lib/theme';

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

const Input = styled.input`
  border: none;
  border-radius: 6px;
  background: var(${theme.palette.bnw900});
  flex-grow: 1;
  font-size: 0.9375rem;
  outline: 0;
  padding: 0 1.125rem;

  &::placeholder {
    color: var(${theme.palette.bnw600});
  }
`;
const SearchInput = reflect({
  view: Input,
  bind: {
    placeholder: 'Search placeholder',
    value: model.$searchValue,
    onChange: model.searchFieldChanged,
  },
});
