import type { EditorValue } from '@cardbox/editor';

/**
 * Получить текст в Editor#value формате
 * @remark Скорее всего не нужен будет в таком виде позднее, т.к. пока что разрабатывается чисто под v0 демо
 * @see @cardbox/editor
 */
export const getValueNode = (text: string): EditorValue => [
  {
    type: 'paragraph',
    children: [{ text }],
  },
];

// FIXME: get from @editor later
export const INITIAL_VALUE: EditorValue = [
  { type: 'paragraph', children: [{ text: '' }] },
];
