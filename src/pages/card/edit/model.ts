import { StartParams } from '@box/lib/page-routing';
import { attach, combine, createEvent, restore, sample } from 'effector-root';
import { cardModel } from '@box/entities/card';
import { historyPush } from '@box/entities/navigation';

import { paths } from '../../paths';

// FIXME: dry with pages/card/view
export const getCardByIdFx = attach({ effect: cardModel.getCardByIdFx });
export const submitChangesFx = attach({
  effect: cardModel.draft.submitChangesFx,
});
export const pageLoaded = createEvent<StartParams>();
export const $pagePending = restore(getCardByIdFx.pending.updates, true);

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

// Возвращаем на страницу карточки после сохранения/отмены изменений
sample({
  // FIXME: process response success
  source: submitChangesFx.done,
  fn: ({ params }) => paths.card(params.id),
  target: historyPush,
});
sample({
  source: cardModel.draft.resetChanges,
  // FIXME: get from store
  fn: (cartId) => paths.card(cartId),
  target: historyPush,
});
