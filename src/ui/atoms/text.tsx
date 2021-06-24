import React from 'react';
import styled from 'styled-components';

export enum TextType {
  header1 = 'header-1',
  header2 = 'header-2',
  header3 = 'header-3',
  header4 = 'header-4',
  header5 = 'header-5',
  header6 = 'header-6',
  primary = 'p',
  small = 'small',
}

interface TextProps {
  type?: TextType;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
  className?: string;
  title?: string;
}
export const Text: React.FC<TextProps> = ({
  children,
  type = TextType.primary,
  as,
  className,
  title,
}) => (
  <TextStyled
    data-type={type}
    as={as || mapTypeToAs(type)}
    className={className}
    title={title}
  >
    {children}
  </TextStyled>
);

function mapTypeToAs(type: TextType) {
  /* eslint-disable prettier/prettier */
  switch (type) {
    case TextType.header1:
      return 'h1';
    case TextType.header2:
      return 'h2';
    case TextType.header3:
      return 'h3';
    case TextType.header4:
      return 'h4';
    case TextType.header5:
      return 'h5';
    case TextType.header6:
      return 'h6';
    case TextType.small:
      return 'span';
    default:
      return 'p';
  }
  /* eslint-enable prettier/prettier */
}

const TextStyled = styled.p<{ 'data-type': TextType }>`
  margin: 0;
  font-family: TT Hoves, sans-serif;
  font-style: normal;
  font-weight: normal;

  &[data-type=${TextType.primary}] {
  }
  &[data-type=${TextType.small}] {
    font-size: 15px;
    line-height: 21px;
  }
  &[data-type=${TextType.header1}] {
    font-size: 36px;
    line-height: 54px;
  }
  &[data-type=${TextType.header4}] {
    font-weight: 500;
    font-size: 30px;
    line-height: 42px;
  }
  &[data-type=${TextType.header6}] {
    font-size: 21px;
    line-height: 30px;
  }
`;
