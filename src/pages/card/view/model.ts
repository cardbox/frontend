import { attach, combine, createEvent, createStore, guard, sample } from 'effector';

import * as sessionModel from '@box/entities/session';
import { cardModel } from '@box/entities/card';
import { withOpenGraph } from '@box/entities/opengraph';
import { $session } from '@box/entities/session';

import type { Card, User } from '@box/shared/api';
import { internalApi } from '@box/shared/api';
import { routes } from '@box/shared/routes';

const currentRoute = routes.card.view;

export const cardsGetFx = attach({ effect: internalApi.cardsGet });
export const cardsDeleteFx = attach({ effect: internalApi.cardsDelete });
export const usersGetFx = attach({ effect: internalApi.usersGet });
export const cardsListFx = attach({ effect: internalApi.cardsList });

export const deleteCard = createEvent();

export const $currentCard = combine(
  cardModel.$cardsCache,
  currentRoute.$params,
  ({ cache }, params) => (cache[params.cardId] ?? null) as Card | null,
);
export const $cardAuthor = createStore<User | null>(null);
export const $pagePending = cardsGetFx.pending;

export const $pageTitle = combine(
  $currentCard,
  $pagePending,

  (card, isLoading) => {
    if (isLoading) return 'Loading...';
    if (!card) return 'Card not found';
    return card.title;
  },
);

export const $isAuthorViewing = combine(
  $currentCard,
  sessionModel.$session,
  (card, viewer) => viewer?.id === card?.authorId,
);

withOpenGraph({
  route: currentRoute,
  openGraph: $currentCard.map((card) => {
    if (!card) return null;
    return {
      type: 'article',
      tag: card.tags as string[],
      description: card.summary ?? '',
      title: card.title,
      path: '', // paths.cardView(card.id), // How to resolve link from effector?
    };
  }),
});

sample({
  clock: [currentRoute.opened, currentRoute.updated],
  fn: ({ params: { cardId } }) => ({ body: { cardId } }),
  target: cardsGetFx,
});

// Обработка события удаления карточки
guard({
  clock: deleteCard,
  source: $currentCard,
  filter: (card): card is Card => card !== null,
  // TODO: prevent calling FX if current user is not an author of card
  target: cardsDeleteFx.prepend((card: Card) => ({
    body: { cardId: card.id },
  })),
});

// Возвращаем на домашнюю страницу после события удаления карточки
sample({
  clock: cardsDeleteFx.done,
  // FIXME: push later to card.author page
  target: routes.home.open,
});

$cardAuthor.reset(currentRoute.closed);

// FIXME: move to entities/user?
$cardAuthor.on(cardsGetFx.doneData, (_, { answer }) => answer.user);

// TODO: Will be deleted after BOX-250
const favoritesCtxLoaded = sample({
  source: $session,
  clock: currentRoute.opened,
  fn: (user) => ({
    body: { authorId: user?.id, favorites: true },
  }),
  target: cardsListFx,
});

sample({
  source: favoritesCtxLoaded.doneData,
  fn: ({ answer }) => answer.cards.map(({ id }) => id),
  target: cardModel.changeFavorites,
});
