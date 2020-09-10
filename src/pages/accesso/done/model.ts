import { createStart } from 'lib/page-routing';

export const pageReady = createStart();

const authorizeRequestDone = pageReady.map(({ query }) => ({
  state: query.state,
  code: query.code,
}));

authorizeRequestDone.watch(console.info);
