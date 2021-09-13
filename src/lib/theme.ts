import { css } from 'styled-components';

// in case of modifying the palette you can only modify this object
// without modifying the rest
const customPropsObject = {
  wizard: {
    wizard1000: '#fff',
    wizard950: '#f6f5ff',
    wizard900: '#e8e6fe',
    wizard850: '#d6d2fe',
    wizard800: '#c0b9fe',
    wizard750: '#a59bfd',
    wizard700: '#8a7dfc',
    wizard650: '#6f5ffc',
    wizard600: '#5441fb',
    wizard550: '#3923fb',
    wizard500: '#1e05fa',
    wizard450: '#1a04dc',
    wizard400: '#1604be',
    wizard350: '#1303a0',
    wizard300: '#0f0382',
    wizard250: '#0c0264',
    wizard200: '#080146',
    wizard150: '#05012d',
    wizard100: '#030119',
    wizard50: '#01000a',
    wizard0: '#000',
  },
  notice: {
    notice1000: '#fff',
    notice950: '#fef6f7',
    notice900: '#fbe9eb',
    notice850: '#f9d8db',
    notice800: '#f5c2c7',
    notice750: '#f1a7af',
    notice700: '#ec8d97',
    notice650: '#e8737e',
    notice600: '#e45866',
    notice550: '#e03e4e',
    notice500: '#db2436',
    notice450: '#c11f30',
    notice400: '#a71b29',
    notice350: '#8c1723',
    notice300: '#72131c',
    notice250: '#580e16',
    notice200: '#3d0a0f',
    notice150: '#27060a',
    notice100: '#160405',
    notice50: '#090102',
    notice0: '#000',
  },
  success: {
    success1000: '#fff',
    success950: '#f7fdf9',
    success900: '#ebfaef',
    success850: '#daf6e3',
    success800: '#c6f1d3',
    success750: '#adebc0',
    success700: '#95e4ad',
    success650: '#7cde9a',
    success600: '#64d887',
    success550: '#4bd274',
    success500: '#33cc61',
    success450: '#2db455',
    success400: '#279b4a',
    success350: '#21833e',
    success300: '#1b6a32',
    success250: '#145227',
    success200: '#0e391b',
    success150: '#092511',
    success100: '#05140a',
    success50: '#020804',
    success0: '#000',
  },
  // black and white
  bnw: {
    bnw1000: '#fff',
    bnw950: '#faf9fa',
    bnw900: '#f1f1f3',
    bnw850: '#e6e6ea',
    bnw800: '#d9d8df',
    bnw750: '#c8c7d1',
    bnw700: '#b8b7c3',
    bnw650: '#a8a6b5',
    bnw600: '#9795a7',
    bnw550: '#878599',
    bnw500: '#76748b',
    bnw450: '#68667a',
    bnw400: '#5a586a',
    bnw350: '#4c4a59',
    bnw300: '#3e3c48',
    bnw250: '#2f2e38',
    bnw200: '#212027',
    bnw150: '#151519',
    bnw100: '#0c0c0e',
    bnw50: '#050506',
    bnw0: '#000',
  },
};
function customPropObjectToCss([key, value]: [key: string, value: string]) {
  return `--${key}: ${value};`;
}

export const customProps = css`
  :root {
    ${Object.keys(customPropsObject).map((subPaletteName) =>
      Object.entries(customPropsObject[subPaletteName] as [string, string]).map(
        customPropObjectToCss,
      ),
    )}
  }
`;

function customPropsToApi(props: Record<string, string>) {
  const apiKeys = Object.keys(props).map((key) => [key, `--${key}`]);
  const subPaletteName = Object.keys(props)[0].replace(/\d+$/, '');
  apiKeys.push([subPaletteName, `--${subPaletteName}500`]);
  apiKeys.push([`${subPaletteName}Disabled`, `--${subPaletteName}800`]);
  apiKeys.push([`${subPaletteName}Hover`, `--${subPaletteName}400`]);
  apiKeys.push([`${subPaletteName}Pressed`, `--${subPaletteName}300`]);
  return Object.fromEntries(apiKeys);
}
const wizardApi = customPropsToApi(customPropsObject.wizard);
const bnwApi = customPropsToApi(customPropsObject.bnw);
const noticeApi = customPropsToApi(customPropsObject.notice);
const successApi = customPropsToApi(customPropsObject.success);

// because of customPropsToApi function (which was created to automate custom
// properties creation) ts cannot output types. in the result we don't have
// autocomplete in the theme usage. to fix it we have to describe types like so.
type WizardKeys =
  | keyof typeof customPropsObject.wizard
  | 'wizard'
  | 'wizardDisabled'
  | 'wizardHover'
  | 'wizardPressed';
type BnwKeys =
  | keyof typeof customPropsObject.bnw
  | 'bnw'
  | 'bnwDisabled'
  | 'bnwHover'
  | 'bnwPressed';
type NoticeKeys =
  | keyof typeof customPropsObject.notice
  | 'notice'
  | 'noticeDisabled'
  | 'noticeHover'
  | 'noticePressed';
type SuccessKeys =
  | keyof typeof customPropsObject.success
  | 'success'
  | 'successDisabled'
  | 'successHover'
  | 'successPressed';
type AllKeys = WizardKeys | BnwKeys | NoticeKeys | SuccessKeys;
const palette: Record<AllKeys, string> = {
  ...wizardApi,
  ...bnwApi,
  ...noticeApi,
  ...successApi,
};
type SpacingParams =
  | []
  | [number]
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];

const getPx = (space = 1) => `${space * 6}px`;
export const theme = {
  palette,
  shadows: [
    'none',
    `0 3px 9px var(${palette.bnw900})`,
    `0 3px 9px var(${palette.bnw950})`,
    `0 6px 9px var(${palette.bnw900})`,
  ],
  spacing: (...spaces: SpacingParams) => {
    const [top, right, bottom, left] = spaces;
    switch (spaces.length) {
      case 0:
        return getPx();
      case 1:
        return getPx(top);
      case 2:
        return `${getPx(top)} ${getPx(right)}`;
      case 3:
        return `${getPx(top)} ${getPx(right)} ${getPx(bottom)}`;
      default:
        return `${getPx(top)} ${getPx(right)} ${getPx(bottom)} ${getPx(left)}`;
    }
  },
};
