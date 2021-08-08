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
import { paths } from '@box/pages/paths';

export const getCardByIdFx = attach({ effect: cardModel.getCardByIdFx });
export const deleteCardByIdFx = attach({ effect: cardModel.deleteCardByIdFx });
export const pageLoaded = createEvent<StartParams>();
export const $pagePending = restore(getCardByIdFx.pending.updates, true);
export const deleteCard = createEvent();

sample({
  source: pageLoaded,
  fn: ({ params }) => params.cardId,
  target: getCardByIdFx,
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
  target: deleteCardByIdFx,
});

// Возвращаем на домашнюю страницу после события удаления карточки
sample({
  clock: deleteCardByIdFx.done,
  // FIXME: push user to profile
  fn: () => paths.home(),
  target: historyPush,
});
