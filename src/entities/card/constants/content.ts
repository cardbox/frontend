import { EditorValue } from '@cardbox/editor';

export const content: EditorValue = [
  {
    type: 'paragraph',
    children: [
      {
        text:
          'Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item).',
      },
    ],
  },
];
