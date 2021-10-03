import * as sessionModel from '@box/entities/session';
import type { Card, User } from '@box/shared/api';
import {
  attach,
  combine,
  createDomain,
  createEvent,
  createStore,
  guard,
  sample,
} from 'effector';
import { cardModel } from '@box/entities/card';
import { createHatch } from 'framework';
import { historyPush } from '@box/entities/navigation';
import { internalApi } from '@box/shared/api';
import { paths } from '@box/pages/paths';

export const hatch = createHatch(createDomain('CardViewPage'));

export const cardsGetFx = attach({ effect: internalApi.cardsGet });
export const cardsDeleteFx = attach({ effect: internalApi.cardsDelete });
export const usersGetFx = attach({ effect: internalApi.usersGet });

export const deleteCard = createEvent();

export const $currentCard = combine(
  cardModel.$cardsCache,
  hatch.$params,
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

sample({
  clock: [hatch.enter, hatch.update],
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
  fn: () => paths.home(),
  target: historyPush,
});

// FIXME: move to entities/user?
$cardAuthor.on(cardsGetFx.doneData, (_, { answer }) => answer.user);
