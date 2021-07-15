import { StartParams } from '@box/lib/page-routing';
import { attach, createEvent, sample } from 'effector-root';
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
  // FIXME: process response success
  source: cardActionsModel.submitChangesFx.done,
  fn: ({ params }) => paths.card(params.id),
  target: historyPush,
});
sample({
  source: cardActionsModel.resetChanges,
  // FIXME: get from store
  fn: (cartId) => paths.card(cartId),
  target: historyPush,
});
