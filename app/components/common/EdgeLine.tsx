"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  height?: string;
  color?: string;
  delay?: number;
  direction?: "left" | "center";
  className?: string;
};

// rounded top rule that draws in once it scrolls into view: left to right, or out from the centre to both ends
const EdgeLine = ({ height = "h-[10px]", color = "border-primary/10", delay = 0, direction = "left", className = "" }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const line = ref.current;
    if (!line) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }

    // in view isn't enough: the footer sits under the page and is only revealed as content scrolls off,
    // so wait until nothing else sits over the line's centre (checked against the parent, as the clipped line itself can't be hit)
    let frame = 0;
    const check = () => {
      frame = 0;
      const rect = line.getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.9) return;
      const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      if (!hit || !line.parentElement?.contains(hit)) return;
      stop();
      setDrawn(true);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    const stop = () => {
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
    observer.observe(line);
    return stop;
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      style={{
        clipPath: drawn ? "inset(0 0 0 0)" : direction === "center" ? "inset(0 50% 0 50%)" : "inset(0 100% 0 0)",
        transitionDelay: `${delay}s`,
      }}
      className={`block rounded-t-[10px] border-t transition-[clip-path] duration-[1200ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${height} ${color} ${className}`}
    />
  );
};

export default EdgeLine;
