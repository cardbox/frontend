import { Model, belongsTo, createServer, hasMany } from 'miragejs';

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
      user: Model.extend({
        cards: hasMany('cards'),
        favorites: hasMany('cards'),
      }),
      card: Model.extend({
        author: belongsTo('users'),
      }),
    },
    // FIXME: resolve !!!
    // serializers: {
    //   application: RestSerializer.extend({
    //     embed: true,
    //   }),
    //   cards: RestSerializer.extend({
    //     include: ['author'],
    //     embed: true,
    //   }),
    //   users: RestSerializer.extend({
    //     include: ['cards'],
    //     embed: true,
    //   }),
    // },
    seeds(server) {
      server.db.loadData({ cards, users });
    },
    routes() {
      this.post('/search.list', (schema) => {
        return {
          users: schema.db.users,
          cards: schema.db.cards,
        };
      });

      this.post('/users.viewer', (schema) => {
        return { user: schema.db.users.find(viewer.id) };
      });

      this.post('/cards.list', (schema) => {
        return { cards: schema.db.cards };
      });

      this.post('/cards.get', (schema, request) => {
        const payload = JSON.parse(request.requestBody);
        const { cardId } = payload;
        if (!cardId) return { card: null };

        return { card: schema.db.cards.find(cardId) };
      });

      this.post('/cards.create', (schema, request) => {
        const payload = JSON.parse(request.requestBody);

        return schema.db.cards.insert({
          ...payload,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });

      this.post('/cards.update', (schema, request) => {
        const payload = JSON.parse(request.requestBody);
        const { cardId, ...diffPayload } = payload;
        if (!cardId || Object.keys(diffPayload).length === 0) return null;

        return schema.db.cards.update(cardId, {
          ...diffPayload,
          updatedAt: new Date().toISOString(),
        });
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
