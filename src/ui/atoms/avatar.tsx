import styled, { css } from 'styled-components';
import { theme } from '@box/lib/theme';

interface Props {
  src?: string;
  size?: string;
}

const attrs = (props: Props) => ({
  'data-size': props.size ?? 'medium',
});

export const Avatar = styled.div.attrs(attrs)<Props>`
  background-color: var(${theme.palette.unknown8});
  border-radius: 3px;

  ${({ src }) =>
    src &&
    css`
      background: url(${src}) no-repeat center / cover;
    `}

  &[data-size='small'] {
    height: 24px;
    width: 24px;
  }

  &[data-size='medium'] {
    height: 42px;
    min-width: 42px;
  }

  &[data-size='large'] {
    height: 72px;
    width: 72px;
  }
`;
