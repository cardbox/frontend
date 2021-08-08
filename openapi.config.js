module.exports = {
  file: 'https://cardbox.github.io/backend/api-internal/openapi.yaml',
  templateFileNameCode: 'index.gen.ts',
  outputDir: './src/api/internal',
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
