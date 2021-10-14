const sizes = {
  mobile: '576px',
  tablet: '768px',
  laptop: '1600px',
  desktop: '1920px',
  desktopL: '2560px',
};

const devices = {
  mobile: `@media screen and (max-width: ${sizes.tablet})`,
  tablet: `@media screen and (max-width: ${sizes.laptop})`,
  laptop: `@media screen and (max-width: ${sizes.desktop})`,
  desktop: `@media screen and (max-width: ${sizes.desktopL})`,
  desktopL: `@media screen and (min-width: ${sizes.desktopL})`,
};

export const breakpoints = {
  sizes,
  devices,
};
