import { Model, createServer } from 'miragejs';

import type { User } from '../types';
import { cards, users, viewer } from './fixtures';

/**
 * Mock-api server for internal development
 * @see https://cardbox.github.io/backend/api-internal/index.html
 */
export function runMockServer() {
  const instance = createServer({
    environment: 'development',
    models: {
      card: Model,
    },
    seeds(server) {
      server.db.loadData({ cards, users });
    },
    routes() {
      this.post('/users.viewer', (schema) => {
        return schema.db.users.find(viewer.id);
      });

      this.post('/cards.list', (schema) => {
        return schema.db.cards;
      });

      this.post('/cards.get', (schema, request) => {
        const payload = JSON.parse(request.requestBody);
        const { cardId } = payload;
        if (!cardId) return null;

        return schema.db.cards.find(cardId);
      });

      this.post('/cards.create', (schema, request) => {
        const payload = JSON.parse(request.requestBody);

        return schema.db.cards.insert(payload);
      });

      this.post('/cards.edit', (schema, request) => {
        const payload = JSON.parse(request.requestBody);
        const { cardId, ...diffPayload } = payload;
        if (!cardId || Object.keys(diffPayload).length === 0) return null;

        return schema.db.cards.update(cardId, diffPayload);
      });

      // @ts-ignore // FIXME: fix later
      this.post('/cards.delete', (schema, request) => {
        const payload = JSON.parse(request.requestBody);
        const { cardId } = payload;
        if (!cardId) return null;

        return schema.db.cards.remove(cardId);
      });

      this.post('/cards.save', (schema, request) => {
        const payload = JSON.parse(request.requestBody);
        const { cardId } = payload;
        if (!cardId) return null;

        // FIXME: refine
        const viewerDb: User = schema.db.users.find(viewer.id);
        viewerDb.favorites.push(cardId);

        return schema.db.users.update(viewer.id, viewerDb);
      });
    },
  });

  return instance;
}
