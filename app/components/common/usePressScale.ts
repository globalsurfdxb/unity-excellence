import { useRef, type PointerEvent } from "react";

const PRESSED = 0.95;
// the press-in always runs this long, so a quick click still shows it
const PRESS_MS = 120;
const RELEASE_MS = 250;
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

// scales an element down while pressed; spread the result onto the element
export const usePressScale = (enabled = true) => {
  const pressedAt = useRef<number | null>(null);
  const running = useRef<Animation[]>([]);

  if (!enabled) return {};

  const press = (e: PointerEvent<HTMLElement>) => {
    pressedAt.current = performance.now();
    // single keyframe: starts from wherever the element is now, so re-pressing mid-release doesn't jump
    running.current.push(e.currentTarget.animate([{ scale: PRESSED }], { duration: PRESS_MS, easing: EASING, fill: "forwards" }));
  };

  const release = (e: PointerEvent<HTMLElement>) => {
    if (pressedAt.current === null) return;
    const delay = Math.max(0, PRESS_MS - (performance.now() - pressedAt.current));
    pressedAt.current = null;

    const back = e.currentTarget.animate([{ scale: 1 }], { duration: RELEASE_MS, delay, easing: EASING, fill: "forwards" });
    running.current.push(back);
    back.onfinish = () => {
      // back at rest, so the held animations can go; skip if a new press started meanwhile
      if (pressedAt.current !== null) return;
      running.current.forEach((a) => a.cancel());
      running.current = [];
    };
  };

  return { onPointerDown: press, onPointerUp: release, onPointerLeave: release, onPointerCancel: release };
};
