import produce from 'immer';
import type { Card } from '@box/api';
import { StartParams } from '@box/lib/page-routing';
import {
  attach,
  combine,
  createEvent,
  createStore,
  restore,
  sample,
} from 'effector-root';
import { cardModel } from '@box/entities/card';

// FIXME: dry with pages/card/view
export const getCardByIdFx = attach({ effect: cardModel.getCardByIdFx });
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

// Edit logic
// TODO: decompose later
// FIXME: simplify to one event?
export const setDraftTitle = createEvent<string>();

export const setDraftContent = createEvent<string>();
export const $cardDraft = createStore<Card | null>(null);

$cardDraft.on(getCardByIdFx.doneData, (_, payload) => payload.card);
$cardDraft.on(setDraftTitle, (state, payload) =>
  produce(state, (draft) => {
    if (!draft) return;
    draft.title = payload;
  }),
);
$cardDraft.on(setDraftContent, (state, payload) =>
  produce(state, (draft) => {
    if (!draft) return;
    draft.content = payload;
  }),
);
