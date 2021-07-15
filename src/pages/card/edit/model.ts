import { StartParams } from '@box/lib/page-routing';
import { attach, createEvent, merge, sample } from 'effector-root';
import { cardActionsModel } from '@box/features/card/actions';
import { cardModel } from '@box/entities/card';
import { historyPush } from '@box/entities/navigation';

import { paths } from '../../paths';

export const getCardByIdFx = attach({ effect: cardModel.getCardByIdFx });
export const pageLoaded = createEvent<StartParams>();

// Подгружаем данные после монтирования страницы
sample({
  source: pageLoaded,
  fn: ({ params }) => params.cardId,
  target: getCardByIdFx,
});

// Возвращаем на страницу карточки после сохранения/отмены изменений
sample({
  clock: merge([
    cardActionsModel.submitChangesFx.done,
    cardActionsModel.resetChanges,
  ]),
  source: cardModel.$currentCardId,
  fn: (cardId) => (cardId ? paths.card(cardId) : paths.home()),
  target: historyPush,
});
