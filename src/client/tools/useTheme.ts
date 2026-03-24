import { useState } from 'react';

const cardPaths = {
  swag: '/images/cards/',
};

export type CardTheme = keyof typeof cardPaths;

let context: {
  cover: CardTheme;
  front: CardTheme;
  changeCover: (cover: CardTheme) => CardTheme;
  changeFront: (front: CardTheme) => CardTheme;
};

const changeCover = (cover: CardTheme) => {
  context.cover = cover;
  return context.cover;
};
const changeFront = (front: CardTheme) => {
  context.front = front;
  return context.front;
};

const getContext = () => {
  if (context) {
    return context;
  }

  context = {
    cover: 'swag',
    front: 'swag',
    changeCover,
    changeFront,
  };

  return context;
};

export const coverPath = () => cardPaths[getContext().cover];
export const frontPath = () => cardPaths[getContext().front];

export const useCardTheme: () => [CardTheme, (newCover: CardTheme) => void, CardTheme, (newFront: CardTheme) => void] = () => {
  const [cover, setCoverState] = useState<CardTheme>(getContext().cover);
  const setCover = (newCover: CardTheme) => {
    setCoverState(() => (getContext().changeCover(newCover)));
  };

  const [front, setFrontState] = useState<CardTheme>(getContext().front);
  const setFront = (newFront: CardTheme) => {
    setFrontState(() => (getContext().changeFront(newFront)));
  };

  return [cover, setCover, front, setFront];
};
