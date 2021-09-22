import styled from 'styled-components';
import { theme } from '@box/lib/theme';

export const Input = styled.input`
  border: none;
  border-radius: ${theme.spacing()};
  background: var(${theme.palette.bnw950});
  flex-grow: 1;
  font-size: 0.9375rem;
  outline: 0;
  padding: 0 1.125rem;

  &::placeholder {
    color: var(${theme.palette.bnw600});
  }
`;
