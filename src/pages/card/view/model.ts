import { StartParams } from '@box/lib/page-routing';
import {
  attach,
  combine,
  createEvent,
  guard,
  restore,
  sample,
} from 'effector-root';
import { cardModel } from '@box/entities/card';
import { historyPush } from '@box/entities/navigation';
import { internalApi } from '@box/api';
import { paths } from '@box/pages/paths';

export const cardsGetFx = attach({ effect: internalApi.cardsGet });
export const cardsDeleteFx = attach({ effect: internalApi.cardsDelete });
export const pageLoaded = createEvent<StartParams>();
export const $pagePending = restore(cardsGetFx.pending.updates, true);
export const deleteCard = createEvent();

sample({
  source: pageLoaded,
  fn: ({ params: { cardId } }) => ({ body: { cardId } }),
  target: cardsGetFx,
});

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
