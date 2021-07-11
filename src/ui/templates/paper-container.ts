import styled from 'styled-components';

export const PaperContainer = styled.article`
  background-color: var(--bnw100);
  border: 1px solid var(--bnw200);
  border-radius: 6px;
  padding: 1.125rem 1.5rem 0.625rem;
  display: flex;
  flex-direction: column;
  outline: 0;

  & > *:not(:first-child) {
    margin-top: 1rem;
  }
`;
