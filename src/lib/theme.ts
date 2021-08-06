const palette = {
  wizard100: '--wizard100',
  wizard300: '--wizard300',
  wizard500: '--wizard500',
  gray100: '--gray100',
  bnw100: '--bnw100',
  bnw200: '--bnw200',
  bnw0: '--bnw0',
  bnw500: '--bnw500',
  bnw700: '--bnw700',
  bnw1000: '--bnw1000',
  notice500: '--notice500',
  unknown1: '--unknown-1',
  unknown2: '--unknown-2',
  unknown3: '--unknown-3',
  unknown4: '--unknown-4',
  unknown5: '--unknown-5',
  unknown6: '--unknown-6',
  unknown7: '--unknown-7',
  unknown8: '--unknown-8',
};

export const theme = {
  palette,
  shadows: [
    'none',
    `0px 3px 9px var(${palette.gray100})`,
    `0px 6px 9px var(${palette.bnw100})`,
    '0 3px 9px #ebebeb',
  ],
};
