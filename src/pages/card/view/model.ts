import { StartParams } from '@box/lib/page-routing';
import { attach, combine, createEvent, restore, sample } from 'effector-root';
import { cardModel } from '@box/entities/card';

export const cardGetByIdFx = attach({ effect: cardModel.cardGetByIdFx });
export const pageLoaded = createEvent<StartParams>();
export const $pagePending = restore(cardGetByIdFx.pending.updates, true);

sample({
  source: pageLoaded,
  fn: ({ params }) => params.cardId,
  target: cardGetByIdFx,
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
