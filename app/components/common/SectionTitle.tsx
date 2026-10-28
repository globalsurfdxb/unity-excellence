"use client";

import { useEffect, useLayoutEffect, useRef, type ElementType } from "react";
import gsap from "gsap";
import { isFooterRevealing, onFooterReveal } from "./footerReveal";

type Props = {
  text: string;
  className?: string;
  tag?: ElementType;
  // false resets the title so it replays when true again, e.g. the active slide of a slider
  play?: boolean;
  // opacity of the letters before they play; 0 keeps the title hidden until its entrance
  startOpacity?: number;
};

// on screen and not covered, e.g. by the footer reveal or another slide
const isUncovered = (el: HTMLElement) => {
  const { left, top, width, height } = el.getBoundingClientRect();
  const hit = document.elementFromPoint(left + width / 2, top + height / 2);
  return !!hit && el.contains(hit);
};

const SectionTitle = ({ text, className = "", tag: Tag = "h2", play = true, startOpacity = 0.4 }: Props) => {
  const rootRef = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const inView = useRef(false);
  const playRef = useRef(play);

  useLayoutEffect(() => {
    playRef.current = play;
  });

  const start = () => {
    if (inView.current && playRef.current) timeline.current?.restart();
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const chars = root.querySelectorAll(".animated-char");

    // the title's own colour mixed with 70% light blue
    const color = getComputedStyle(root).color;
    const own = gsap.utils.splitColor(color);
    const light = gsap.utils.splitColor(getComputedStyle(root).getPropertyValue("--primary-light").trim());
    const tint = `rgb(${own.slice(0, 3).map((c, i) => Math.round(c * 0.3 + light[i] * 0.7)).join(",")})`;

    const ctx = gsap.context(() => {
      gsap.set(chars, { opacity: startOpacity, transformOrigin: "50% 50%", willChange: "transform" });
      timeline.current = gsap.timeline({ paused: true }).to(chars, {
        keyframes: [
          { scale: 1.18, opacity: 1, color: tint, duration: 0.23, ease: "power2.out" },
          { scale: 1, color, duration: 0.35, ease: "power3.out" },
        ],
        stagger: 0.028,
      });
    }, root);

    // in the footer, skip the measuring until the content starts to uncover it
    const inFooter = !!root.closest("footer");
    const uncovered = () => {
      if (!inView.current) {
        if (inFooter && !isFooterRevealing()) return;
        if (!isUncovered(root)) return;
        inView.current = true;
        start();
      }
      window.removeEventListener("scroll", uncovered);
      observer.disconnect();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          uncovered();
          if (!inView.current) window.addEventListener("scroll", uncovered, { passive: true });
        } else {
          window.removeEventListener("scroll", uncovered);
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(root);
    const offReveal = inFooter ? onFooterReveal(uncovered) : undefined;

    return () => {
      offReveal?.();
      window.removeEventListener("scroll", uncovered);
      observer.disconnect();
      ctx.revert();
      timeline.current = null;
      inView.current = false;
    };
  }, [text, startOpacity]);

  useEffect(() => {
    if (!play) {
      timeline.current?.pause(0);
      return;
    }
    if (rootRef.current && isUncovered(rootRef.current)) inView.current = true;
    start();
  }, [play]);

  const lines = text.split("\n");

  return (
    <Tag ref={rootRef} aria-label={text} className={className}>
      {lines.map((line, lineIndex) => {
        const words = line.split(" ");
        return (
          <span key={lineIndex} aria-hidden="true">
            {words.map((word, wordIndex) => (
              <span key={wordIndex}>
                <span className="inline-block whitespace-nowrap">
                  {word.split("").map((char, charIndex) => (
                    <span key={charIndex} className="animated-char inline-block">
                      {char}
                    </span>
                  ))}
                </span>
                {wordIndex < words.length - 1 && " "}
              </span>
            ))}
            {lineIndex < lines.length - 1 && <br />}
          </span>
        );
      })}
    </Tag>
  );
};

export default SectionTitle;
