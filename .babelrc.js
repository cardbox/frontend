module.exports = (api) => {
  api.cache(true);
  const debug = process.env.EFFECTOR_DEBUG === 'true';

  return {
    plugins: [
      [
        'effector/babel-plugin',
        {
          addLoc: debug,
          addNames: debug,
          debugSids: debug,
          factories: ['src/entities/opengraph', '@box/entities/opengraph'],
        },
      ],
      // debug && [
      //   'module-resolver',
      //   {
      //     alias: {
      //       effector: 'effector-logger',
      //     },
      //   },
      // ],
      [
        'styled-components',
        {
          displayName: process.env.STYLED_DEBUG === 'true',
          ssr: true,
        },
      ],
      ['@babel/plugin-proposal-export-namespace-from'],
      [
        'effector/babel-plugin',
        {
          noDefaults: true,
          addLoc: debug,
          debugSids: debug,
          addNames: debug,
          factories: ['framework'],
        },
        'framework',
      ],
    ].filter(Boolean),
    presets: ['patronum/babel-preset'],
  };
};
