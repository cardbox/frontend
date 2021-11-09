/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '@box/shared/lib/breakpoints';

interface TextProps {
  type?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
  className?: string;
  title?: string;
}
export const Text: React.FC<TextProps> = ({
  children,
  type,
  className,
  title,
  ...props
}) => (
  <TextStyled
    data-type={type}
    as={type}
    className={className}
    title={title}
    {...props}
  >
    {children}
  </TextStyled>
);

const TextStyled = styled.p<{ 'data-type': TextProps['type'] }>`
  margin: 0;
  font-family: 'TT Hoves', sans-serif;
  font-style: normal;
  font-weight: normal;

  &[data-type='span'] {
    font-size: 15px;
    line-height: 21px;
  }
  &[data-type='p'] {
    font-size: 0.75rem;
    line-height: 15px;
  }
  &[data-type='h1'] {
    font-weight: 700;
    font-size: 4.5rem;
    line-height: 1.125em;

    ${breakpoints.devices.mobile} {
      font-size: 2.8125rem;
    }
  }
  &[data-type='h3'] {
    font-size: 2.25rem;
    line-height: 54px;
  }
  &[data-type='h4'] {
    font-weight: 500;
    font-size: 1.875rem;
    line-height: 42px;
  }
  &[data-type='h5'] {
    font-weight: 400;
    font-size: 24px;
    line-height: 36px;
  }
  &[data-type='h6'] {
    font-size: 21px;
    line-height: 30px;
  }
`;
