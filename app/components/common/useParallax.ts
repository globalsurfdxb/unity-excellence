import { useEffect, type RefObject } from "react";

// drifts a layer against the scroll inside its clipped frame, from +amount% to -amount% of its height while the frame
// crosses the screen; the layer should overhang the frame by that much top and bottom (e.g. -top-[8%] h-[116%] for 6)
export const useParallax = (frameRef: RefObject<HTMLElement | null>, layerRef: RefObject<HTMLElement | null>, amount = 6) => {
  useEffect(() => {
    const frame = frameRef.current;
    const layer = layerRef.current;
    if (!frame || !layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = frame.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const clamped = Math.min(Math.max(progress, 0), 1);
      layer.style.transform = `translate3d(0, ${(clamped - 0.5) * 2 * amount}%, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // only listens while the frame is on screen
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
      } else {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    });
    observer.observe(frame);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [frameRef, layerRef, amount]);
};
