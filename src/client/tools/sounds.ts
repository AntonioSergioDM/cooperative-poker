const sounds = {
  beep: '/sounds/beep.mp3',
  // beep: '/sounds/beep1.mp3',
  win: '/sounds/win.mp3',
  lose: '/sounds/lose.mp3',
};

export type SoundEffect = keyof typeof sounds;

export const sound = (path: SoundEffect, volume: number = 0.2) => {
  const audio = new Audio(sounds[path]);
  audio.volume = volume || 0.2;
  audio.play().catch((e) => {
    // This catches errors if the browser blocks autoplay
    // (e.g., user hasn't interacted with the page yet)
    console.warn('Audio play failed', e);
  });
};
