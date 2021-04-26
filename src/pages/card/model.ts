import { attach, forward } from 'effector-root';
import { cardGetById } from '@cardbox/api';
import { debug } from 'patronum';

import { $card, $error, $pending, start } from './contract';

const cardLoadFx = attach({ effect: cardGetById });

const loadedId = start.map(({ params }) => params.cardId);

$card.on(cardLoadFx.doneData, (_, { answer }) => answer.card).reset(cardLoadFx.fail);

$error.on(cardLoadFx.failData, (_, error) => error.message).reset(cardLoadFx.done);

forward({ from: loadedId, to: cardLoadFx });
forward({ from: cardLoadFx.pending, to: $pending });

debug(start, cardLoadFx, $card);

$card.watch((card) => {
  console.log('watcher arg card', card);
  console.log('getState card', $card.getState());
});
