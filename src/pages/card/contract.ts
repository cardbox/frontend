import { createStore } from 'effector-root';

import { Card } from '../../api';
import { createStart } from '../../lib/page-routing';

export const start = createStart();
export const $card = createStore<Card | null>(null);
export const $pending = createStore(false);
export const $error = createStore<string | null>(null);
