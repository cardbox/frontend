import { Model, belongsTo, createServer, hasMany } from 'miragejs';

import type { Card, User } from '../types';
import { cards, users, viewer } from './fixtures';

/** little shortcut for search */
function hasIncluding({
  including,
  query,
}: {
  including?: string;
  query: string;
}) {
  if (!including) return false;
  return including.toLowerCase().includes(query);
}
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
      this.namespace = 'api';

      this.post('/search.results', (schema, req) => {
        const { query } = JSON.parse(req.requestBody);
        const users = schema.db.users.where((user: User) => {
          return (
            hasIncluding({ including: user.username, query }) ||
            hasIncluding({ including: user.firstName, query }) ||
            hasIncluding({ including: user.lastName, query })
          );
        });

        const cards = schema.db.cards.where((card: Card) => {
          return (
            hasIncluding({ including: card.title, query }) ||
            // FIXME: impl full-text search later
            hasIncluding({ including: JSON.stringify(card.content), query })
          );
        });

        return {
          users,
          cards,
        };
      });

      this.post('/users.viewer', (schema) => {
        return { user: schema.db.users.find(viewer.id) };
      });

      this.post('/users.get', (schema, request) => {
        const payload = JSON.parse(request.requestBody);
        const { username } = payload;
        if (!username) return { user: null };

        return {
          user: schema.db.users.findBy({ username }),
        };
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
