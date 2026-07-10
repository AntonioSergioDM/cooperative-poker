import { useEffect, useState } from 'react';

/**
 * The poker table (full-screen radial seat layout) was tuned for a roughly
 * desktop-sized viewport. These are the dimensions where cards, chips and seat
 * labels render at their full, unscaled size.
 */
const BASELINE_WIDTH = 1100;
const BASELINE_HEIGHT = 760;

/** How large the board may grow on roomy desktop screens. */
const MAX_SCALE = 1.3;

/**
 * Floor so a phone in portrait keeps the seats/cards legible instead of
 * collapsing to unreadable thumbnails. The radial layout is percentage-based,
 * so seats stay spread out even at this floor.
 */
const MIN_SCALE = 0.55;

const computeScale = () => {
  if (typeof window === 'undefined') {
    return 1;
  }

  const byWidth = window.innerWidth / BASELINE_WIDTH;
  const byHeight = window.innerHeight / BASELINE_HEIGHT;

  // Grow up to MAX_SCALE on big screens; shrink to whichever axis is tightest,
  // but never below MIN_SCALE so mobile stays usable.
  return Math.max(MIN_SCALE, Math.min(MAX_SCALE, byWidth, byHeight));
};

/**
 * Returns a multiplier used to size cards, chips and seat labels so the whole
 * cooperative-poker board fits the current viewport (desktop and mobile alike).
 */
export const useCardScale = (): number => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => setScale(computeScale());

    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return scale;
};

export default useCardScale;
