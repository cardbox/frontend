import type { EditorValue } from '@cardbox/editor';

// Экспортируем отдельно, чтобы могли обращаться к типу, не зная, про реализацию (Editor)
export type CardContent = EditorValue;

export type Card = import('./internal').CardsGetDone['answer']['card'];

export type User = import('./internal').UsersGetDone['answer']['user'];

// FIXME: Просчитывать позднее от User - пока что не получается из-за non-required поля
export interface UserSocial {
  readonly id: string;
  readonly type: string;
  readonly link: string;
  readonly username: string;
}

export type SessionUser = import('./internal').SessionGetDone['answer']['user'];
