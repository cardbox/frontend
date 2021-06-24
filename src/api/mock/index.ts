import { createServer } from 'miragejs';

import { cards } from './fixtures';

export function runMockServer() {
  const server = createServer({
    environment: 'development',
    routes() {
      this.post('/cards.list', () => {
        return cards;
      });
    },
  });

  return server;
}
