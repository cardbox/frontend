const sizes = {
  mobile: 576,
  tablet: 768,
  laptop: 1600,
  desktop: 1920,
  desktopL: 2560,
};

const devices = {
  mobile: `@media screen and (max-width: ${sizes.tablet - 1}px)`,
  tablet: `@media screen and (max-width: ${sizes.laptop - 1}px)`,
  laptop: `@media screen and (max-width: ${sizes.desktop - 1}px)`,
  desktop: `@media screen and (max-width: ${sizes.desktopL - 1}px)`,
  desktopL: `@media screen and (min-width: ${sizes.desktopL}px)`,
};

export const breakpoints = {
  sizes,
  devices,
};
