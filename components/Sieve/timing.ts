// The timing table from the design system (sieve.md), in ms from the start of the animation.
// sieve.css repeats the path and mark numbers in its delays.
export const TIMING = {
  moveStart: 300,
  waveGap: 120,
  waves: 6,
  pathStart: 1500,
  pathEnd: 2100,
  end: 2400,
} as const;

/** The wide (horizontal) composition shows from this width up. Matches sieve.css. */
export const WIDE_QUERY = "(min-width: 1024px)";
