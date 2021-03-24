import { Card, cardGetById } from '@cardbox/api';
import { attach, createStore, forward } from 'effector-root';
import { createStart } from '@cardbox/lib/page-routing';
import { debug } from 'patronum';

const cardLoadFx = attach({ effect: cardGetById });

export const start = createStart();
const loadedId = start.map(({ params }) => params.cardId);

export const $card = createStore<Card | null>(null);
export const $pending = cardLoadFx.pending;

forward({ from: loadedId, to: cardLoadFx });

debug(cardLoadFx, $card);

$card.on(cardLoadFx.doneData, (_, { answer }) => answer.card).on(cardLoadFx.fail, () => null);
