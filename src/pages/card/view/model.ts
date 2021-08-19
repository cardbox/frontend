import * as sessionModel from '@box/entities/session';
import type { User } from '@box/api';
import {
  attach,
  combine,
  createEvent,
  createStore,
  guard,
  restore,
  root,
  sample,
} from 'effector-root';
import { cardModel } from '@box/entities/card';
import { createHatch } from 'framework';
import { historyPush } from '@box/entities/navigation';
import { internalApi } from '@box/api';
import { paths } from '@box/pages/paths';

export const cardsGetFx = attach({ effect: internalApi.cardsGet });
export const cardsDeleteFx = attach({ effect: internalApi.cardsDelete });
export const usersGetFx = attach({ effect: internalApi.usersGet });

export const hatch = createHatch(root.createDomain('CardViewPage'));
export const deleteCard = createEvent();

export const $currentCard = cardModel.$currentCard;
export const $cardAuthor = createStore<User | null>(null);
export const $pagePending = restore(cardsGetFx.pending.updates, true);

export const $pageTitle = combine(
  {
    card: cardModel.$currentCard,
    isLoading: $pagePending,
  },
  ({ card, isLoading }) => {
    if (isLoading) return 'Loading...';
    if (!card) return 'Card not found';
    return card.title;
  },
);

export const $isAuthorViewing = combine(
  cardModel.$currentCard,
  sessionModel.$session,
  (card, viewer) => {
    return viewer && viewer.id === card?.authorId;
  },
);

sample({
  clock: [hatch.enter, hatch.update],
  fn: ({ params: { cardId } }) => ({ body: { cardId } }),
  target: cardsGetFx,
});

// Обработка события удаления карточки
guard({
  clock: deleteCard,
  source: cardModel.$currentCardId,
  filter: (id): id is string => id !== null,
  target: cardsDeleteFx.prepend((cardId: string) => ({ body: { cardId } })),
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
