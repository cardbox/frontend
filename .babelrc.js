module.exports = {
  plugins: [
    [
      'effector/babel-plugin',
      {
        addLoc: true,
        addNames: true,
        debugSids: false,
        factories: [],
      },
    ],
    [
      'module-resolver',
      {
        alias: {
          effector: 'effector-logger',
        },
      },
    ],
    [
      'styled-components',
      {
        displayName: true,
        ssr: true,
      },
    ],
    ['@babel/plugin-proposal-export-namespace-from'],
    [
      'effector/babel-plugin',
      {
        noDefaults: true,
        addLoc: false,
        debugSids: false,
        addNames: false,
        factories: ['framework'],
      },
      'framework',
    ],
  ],
  presets: [],
};
