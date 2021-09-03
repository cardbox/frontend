import React from 'react';
import { Card } from '@box/api/index';
import { createStore } from 'effector-root';
import { debug } from 'patronum';
import { useStore } from 'effector-react/ssr';

export const $currentCard = createStore<Card | null>(null);

debug($currentCard);

export const CardViewPage = () => {
  const card = useStore($currentCard);
  return (
    <>
      <div>{card?.title}</div>
    </>
  );
};
