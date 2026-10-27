import { useSyncExternalStore } from "react";

// lets the intro tell components outside it (e.g. the hero title) when their entrance should play
let cued = false;
const listeners = new Set<() => void>();

export const cueIntro = () => {
  cued = true;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useIntroCue = () => useSyncExternalStore(subscribe, () => cued, () => false);
