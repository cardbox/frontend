import React from 'react';
import { Card } from '@box/api/index';
import { createStore } from 'effector-root';
import { useStore } from 'effector-react/ssr';
import { debug } from 'patronum';

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
