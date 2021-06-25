import { EditorValue } from '@cardbox/editor';

export interface Card {
  id: number;
  title: string;
  updatedAt: string;
  author: string;
  content: EditorValue;
}
