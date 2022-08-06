import { useUnit } from 'effector-react/scope';
import React from 'react';
import styled from 'styled-components';

import { $searchQuery, searchQueryEntered } from '@box/entities/search';

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

function SearchInput() {
  const [value, onChange] = useUnit([$searchQuery, searchQueryEntered]);

  return (
    <input
      placeholder="Search…"
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
      className="rounded flex-grow flex outline-none text-2xl bg-gray-100 items-baseline px-4 pt-1 leading-3"
    />
  );
}
