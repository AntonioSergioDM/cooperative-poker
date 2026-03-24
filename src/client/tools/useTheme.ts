import { useState } from 'react';

const cardPaths = {
  swag: '/images/cards/swag/',
  modern: '/images/cards/modern/',
  classic: '/images/cards/classic/',
  vintage: '/images/cards/vintage/',
  drawings: '/images/cards/drawings/',
  simplified: '/images/cards/simplified/',
  futuristic: '/images/cards/modern/modern/',
  vintage_clean: '/images/cards/vintage/clean/',
};

export type CardTheme = keyof typeof cardPaths;

export const availableThemes: CardTheme[] = Object.keys(cardPaths) as CardTheme[];

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
    cover: 'drawings',
    front: 'drawings',
    changeCover,
    changeFront,
  };

  return context;
};

export const coverPath = (theme?: CardTheme) => `${cardPaths[theme || getContext().cover]}Cover.png`;

export const frontPath = (cardId?: string, theme?: CardTheme) => (cardId && cardId !== 'Cover' ? `${cardPaths[theme || getContext().front]}${cardId}.png` : coverPath(theme));

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
