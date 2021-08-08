module.exports = {
  file: 'https://cardbox.github.io/backend/api-internal/openapi.yaml',
  templateFileNameCode: 'generated.ts',
  outputDir: './src/api',
  presets: [
    [
      'effector-openapi-preset',
      {
        effectorImport: 'effector-root',
        requestName: 'requestClient',
        requestPath: './request/client',
      },
    ],
  ],
};
