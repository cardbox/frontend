# Cardbox Frontend

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](http://prettier.io) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org) [![](https://img.shields.io/badge/feature/slices-1.0-blue)](https://featureslices.dev/v1.0)

## Development

1. Press `Clone` button.

2. Install and run with JSON server mocks:

```bash
yarn install
yarn dev:server # run mock server
yarn start:dev # run cardbox frontend
```

3. Or run with no mocks:

```bash
yarn install
yarn start
```

- Use `import {} from "effector-root"` instead of `"effector"`. All units should be created in the root domain.

## Structure

https://sova.dev/application-structure

- `src/app/server.tsx` — Express server, that renders React to stream
- `src/index.tsx` — Node.js entry point, that have hot module replacement and imports server
- `src/app/client.tsx` — Browser side entry point, that hydrates stores and react app
- `src/app/application.tsx` — Application component, that have global styles and effector provider
- `src/pages/index.tsx` — Pages component
- `src/pages/routes.ts` — Static routes config
- `src/pages/:page-name/index.tsx` — View for single specific page
- `src/pages/:page-name/model.ts` — Business-logic for specific page, that contains single level logic layer
- `src/lib` — Internal libraries
- `src/lib/effector` — START event name to use as page property
