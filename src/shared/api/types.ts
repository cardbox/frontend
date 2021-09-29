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

// FIXME: implement on real API

export type CommentUser = Pick<User, 'id' | 'username'>;

export interface Question {
  readonly topic: string;
  readonly author: CommentUser;
  readonly when: string;
  readonly text: React.ReactNode;
  readonly resolved?: boolean;
  readonly responses: {
    authors: string[];
    count: number;
    lastResponseAt: string;
  };
}
export interface Answer {
  readonly author: CommentUser;
  readonly title: string;
  readonly when: string;
  readonly why: 'liked' | false;
  readonly text: React.ReactNode;
}
