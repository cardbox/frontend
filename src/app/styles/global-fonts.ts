import BlackItalicWoff2 from '@box/shared/assets/fonts/TT_Hoves_Black_Italic.woff2';
import BlackWoff2 from '@box/shared/assets/fonts/TT_Hoves_Black.woff2';
import BoldItalicWoff2 from '@box/shared/assets/fonts/TT_Hoves_Bold_Italic.woff2';
import BoldWoff2 from '@box/shared/assets/fonts/TT_Hoves_Bold.woff2';
import DemiBoldItalicWoff2 from '@box/shared/assets/fonts/TT_Hoves_DemiBold_Italic.woff2';
import DemiBoldWoff2 from '@box/shared/assets/fonts/TT_Hoves_DemiBold.woff2';
import ExtraBoldItalicWoff2 from '@box/shared/assets/fonts/TT_Hoves_ExtraBold_Italic.woff2';
import ExtraBoldWoff2 from '@box/shared/assets/fonts/TT_Hoves_ExtraBold.woff2';
import ExtraLightItalicWoff2 from '@box/shared/assets/fonts/TT_Hoves_ExtraLight_Italic.woff2';
import ExtraLightWoff2 from '@box/shared/assets/fonts/TT_Hoves_ExtraLight.woff2';
import ItalicWoff2 from '@box/shared/assets/fonts/TT_Hoves_Italic.woff2';
import LightItalicWoff2 from '@box/shared/assets/fonts/TT_Hoves_Light_Italic.woff2';
import LightWoff2 from '@box/shared/assets/fonts/TT_Hoves_Light.woff2';
import MediumItalicWoff2 from '@box/shared/assets/fonts/TT_Hoves_Medium_Italic.woff2';
import MediumWoff2 from '@box/shared/assets/fonts/TT_Hoves_Medium.woff2';
import RegularWoff2 from '@box/shared/assets/fonts/TT_Hoves_Regular.woff2';
import ThinItalicWoff2 from '@box/shared/assets/fonts/TT_Hoves_Thin_Italic.woff2';
import ThinWoff2 from '@box/shared/assets/fonts/TT_Hoves_Thin.woff2';
import { css } from 'styled-components';

export const globalFonts = css`
  @font-face {
    font-family: 'TT Hoves';
    font-weight: 100;
    font-style: normal;
    src: local('TT Hoves'), url(${ThinWoff2}) format('woff2');
  }
  @font-face {
    font-family: 'TT Hoves';
    font-weight: 100;
    font-style: italic;
    src: local('TT Hoves'), url(${ThinItalicWoff2}) format('woff2');
  }

  @font-face {
    font-family: 'TT Hoves';
    font-weight: 200;
    font-style: normal;
    src: local('TT Hoves'), url(${ExtraLightWoff2}) format('woff2');
  }
  @font-face {
    font-family: 'TT Hoves';
    font-weight: 200;
    font-style: italic;
    src: local('TT Hoves'), url(${ExtraLightItalicWoff2}) format('woff2');
  }

  @font-face {
    font-family: 'TT Hoves';
    font-weight: 300;
    font-style: normal;
    src: local('TT Hoves'), url(${LightWoff2}) format('woff2');
  }
  @font-face {
    font-family: 'TT Hoves';
    font-weight: 300;
    font-style: italic;
    src: local('TT Hoves'), url(${LightItalicWoff2}) format('woff2');
  }

  @font-face {
    font-family: 'TT Hoves';
    font-weight: 400;
    font-style: normal;
    src: local('TT Hoves'), url(${RegularWoff2}) format('woff2');
  }
  @font-face {
    font-family: 'TT Hoves';
    font-weight: 400;
    font-style: italic;
    src: local('TT Hoves'), url(${ItalicWoff2}) format('woff2');
  }

  @font-face {
    font-family: 'TT Hoves';
    font-weight: 500;
    font-style: normal;
    src: local('TT Hoves'), url(${MediumWoff2}) format('woff2');
  }
  @font-face {
    font-family: 'TT Hoves';
    font-weight: 500;
    font-style: italic;
    src: local('TT Hoves'), url(${MediumItalicWoff2}) format('woff2');
  }

  @font-face {
    font-family: 'TT Hoves';
    font-weight: 600;
    font-style: normal;
    src: local('TT Hoves'), url(${DemiBoldWoff2}) format('woff2');
  }
  @font-face {
    font-family: 'TT Hoves';
    font-weight: 600;
    font-style: italic;
    src: local('TT Hoves'), url(${DemiBoldItalicWoff2}) format('woff2');
  }

  @font-face {
    font-family: 'TT Hoves';
    font-weight: 700;
    font-style: normal;
    src: local('TT Hoves'), url(${BoldWoff2}) format('woff2');
  }
  @font-face {
    font-family: 'TT Hoves';
    font-weight: 700;
    font-style: italic;
    src: local('TT Hoves'), url(${BoldItalicWoff2}) format('woff2');
  }

  @font-face {
    font-family: 'TT Hoves';
    font-weight: 800;
    font-style: normal;
    src: local('TT Hoves'), url(${ExtraBoldWoff2}) format('woff2');
  }
  @font-face {
    font-family: 'TT Hoves';
    font-weight: 800;
    font-style: italic;
    src: local('TT Hoves'), url(${ExtraBoldItalicWoff2}) format('woff2');
  }

  @font-face {
    font-family: 'TT Hoves';
    font-weight: 900;
    font-style: normal;
    src: local('TT Hoves'), url(${BlackWoff2}) format('woff2');
  }
  @font-face {
    font-family: 'TT Hoves';
    font-weight: 900;
    font-style: italic;
    src: local('TT Hoves'), url(${BlackItalicWoff2}) format('woff2');
  }
`;
