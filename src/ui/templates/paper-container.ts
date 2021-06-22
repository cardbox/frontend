import styled from 'styled-components';

export const PaperContainer = styled.article`
  background-color: #fbfafb;
  border: 1px solid #eeeef1;
  border-radius: 6px;
  box-shadow: 0 3px 9px #fbfafb;
  padding: 1.125rem 1.5rem 0.625rem;
  display: flex;
  flex-direction: column;

  & > *:not(:first-child) {
    margin-top: 1rem;
  }
`;
