const sounds = {
  beep: '/sounds/beep.mp3',
  // beep: '/sounds/beep1.mp3',
};

export const sound = (path: 'beep', volume: number = 0.2) => {
  const audio = new Audio(sounds[path]);
  audio.volume = volume || 0.2;
  audio.play().catch((e) => {
    // This catches errors if the browser blocks autoplay
    // (e.g., user hasn't interacted with the page yet)
    console.warn('Audio play failed', e);
  });
};
