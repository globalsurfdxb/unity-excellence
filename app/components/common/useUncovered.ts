import { useEffect, useRef, useState } from "react";
import { isFooterRevealing, onFooterReveal } from "./footerReveal";

// true once the element is on screen with nothing covering its centre, e.g. the footer that the page slides off;
// a plain in-view check fires while it is still hidden underneath
export const useUncovered = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [uncovered, setUncovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // the footer is in view under the page the whole time, so skip the measuring until the content starts to uncover it
    const inFooter = !!el.closest("footer");
    let frame = 0;
    const check = () => {
      frame = 0;
      if (inFooter && !isFooterRevealing()) return;
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.9) return;
      const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      if (!hit || !el.contains(hit)) return;
      stop();
      setUncovered(true);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    const offReveal = inFooter ? onFooterReveal(onScroll) : undefined;
    const stop = () => {
      offReveal?.();
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    });
    observer.observe(el);
    return stop;
  }, []);

  return [ref, uncovered] as const;
};
