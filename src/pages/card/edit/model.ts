import produce from 'immer';
import type { Card } from '@box/api';
import { StartParams } from '@box/lib/page-routing';
import {
  attach,
  combine,
  createEffect,
  createEvent,
  createStore,
  restore,
  sample,
} from 'effector-root';
import { cardModel } from '@box/entities/card';
import { historyPush } from '@box/entities/navigation';
import { internalApi } from '@box/api';

import { paths } from '../../paths';

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

// FIXME: simplify, get from store
export const submitChangesFx = createEffect((payload: Card) => {
  // FIXME: validate payload
  return internalApi.cards.update({
    cardId: payload.id,
    title: payload.title,
    content: payload.content,
    tags: payload.tags,
  });
});

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

// FIXME: process response success
$cardDraft.on(submitChangesFx.done, () => null);

sample({
  source: submitChangesFx.done,
  fn: ({ params }) => paths.card(params.id),
  target: historyPush,
});

// Reset changes

// FIXME: get from store
export const resetChanges = createEvent<string>();

$cardDraft.on(resetChanges, () => null);

sample({
  source: resetChanges,
  fn: (cartId) => paths.card(cartId),
  target: historyPush,
});
