import { attach, createStore, forward } from 'effector-root';
import { cardsLatestGet } from '@cardbox/api';
import { createStart } from '@cardbox/lib/page-routing';

import { Card } from './types';

const loadFx = attach({ effect: cardsLatestGet });

export const start = createStart();

export const $cards = createStore<Card[]>([]);

forward({ from: start, to: loadFx });

$cards.on(loadFx.doneData, (_, { answer }) => answer.cards);
