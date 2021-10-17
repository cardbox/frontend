import React from 'react';
import styled from 'styled-components';

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
}) => (
  <TextStyled data-type={type} as={type} className={className} title={title}>
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
    font-size: 12px;
    line-height: 15px;
  }
  &[data-type='h1'] {
    font-weight: 600;
    font-size: 72px;
    line-height: 81px;
  }
  &[data-type='h3'] {
    font-size: 36px;
    line-height: 54px;
  }
  &[data-type='h4'] {
    font-weight: 500;
    font-size: 30px;
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
