module.exports = {
  file: 'https://cardbox.github.io/backend/api-internal/openapi.yaml',
  templateFileNameCode: 'index.gen.ts',
  outputDir: './src/api/internal',
  presets: [
    [
      'effector-openapi-preset',
      {
        effectorImport: 'effector-root',
        requestName: 'requestFx',
        requestPath: '@box/shared/api/request',
      },
    ],
  ],
};
