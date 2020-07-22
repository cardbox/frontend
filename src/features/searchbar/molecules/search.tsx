import React from 'react';
import styled from 'styled-components';
import { button } from 'ui';

export const Search = () => {
  return (
    <Container>
      <Input placeholder="Search placeholder" />
      <button.Text>Advanced</button.Text>
    </Container>
  );
};

const Container = styled.div`
  border: 1px solid #e7e5ee;
  border-radius: 3px;
  display: flex;
  height: 42px;
`;

const Input = styled.input`
  border: none;
  border-right: 1px solid #e7e5ee;
  flex-grow: 1;
  font-size: 0.9375rem;
  outline: 0;
  padding: 0 1.125rem;

  &::placeholder {
    color: #a39bb2;
  }
`;
