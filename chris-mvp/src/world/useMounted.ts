import { useEffect, useState } from 'react';

/**
 * True from the second commit on. drei's <Html> creates its DOM root in a layout effect that needs its
 * group already attached; with React 19 the first label in the scene can miss that and stay empty.
 * Mounting labels one commit later avoids it.
 */
export function useMounted() {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(true), []);
  return on;
}
