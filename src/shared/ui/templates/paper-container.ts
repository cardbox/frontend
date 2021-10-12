import styled from 'styled-components';
import { theme } from '@box/shared/lib/theme';

export const PaperContainer = styled.article`
  background-color: var(${theme.palette.bnw900});
  border: 1px solid var(${theme.palette.bnw850});
  border-radius: 6px;
  padding: 1.125rem 1.5rem 0.625rem;
  display: flex;
  flex-direction: column;
  outline: 0;

  & > *:not(:first-child),
  & > *:not(:last-child) {
    margin-top: 1rem;
  }
`;
