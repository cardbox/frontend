# Cardbox Frontend

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](http://prettier.io) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org) [![](https://img.shields.io/badge/feature/slices-1.0-blue)](https://featureslices.dev/v1.0)

## Get Started

1. **Clone** repository

1. Prepare **local certificate authorithy**

    Setup via [mkcert](https://github.com/FiloSottile/mkcert):

    ```bash
    mkcert -install
    ```

    Then generate your personal local certificates for cardbox:

    ```bash
    yarn prepare:certs
    ```

1. Setup local **env** for development

    Copy from `.env.sample` file and make sure the default settings are correct

    ```properties
    # Change some if you need
    CLIENT_PUBLIC_PATH=https://localhost:9101/
    PORT=9100
    BACKEND_URL=https://cardbox.sova.dev/api/internal
    ```

1. Install and run:

    ```bash
    yarn install
    yarn start
    ```

### Other commands

```bash
yarn api     # update api by codegen
yarn lint    # lint project with fix
```

## Development

### HotReload

Sometime you should manually restart server for new changes

```bash
# Just type and press ENTER:
rs
```

### Effector

- Use `import {} from "effector-root"` instead of `"effector"`. All units should be created in the root domain.
- Use `import { debug } from "patronum"` for debug effector units

### Structure

Project designed by [FeatureSliced](https://feature-sliced.design/)

> **WIP:** Project is migrating from FSv1 to FSv2

#### app

- `src/app/application.tsx` — Application component, that have global styles and effector provider
- `src/app/server.tsx` — Express server, that renders React to stream
- `src/app/client.tsx` — Browser side entry point, that hydrates stores and react app
- `src/index.tsx` — Node.js entry point, that have hot module replacement and imports server

#### pages

- `src/pages/index.tsx` — Pages component
- `src/pages/routes.ts` — Static routes config
- `src/pages/:page-name/index.tsx` — View for single specific page
- `src/pages/:page-name/model.ts` — Business-logic for specific page, that contains single level logic layer

#### shared

> **WIP:** soon will be placed at `src/shared`

- `src/lib` — Internal libraries
- `src/ui` — Internal UIKit
- `src/lib/effector` — START event name to use as page property
