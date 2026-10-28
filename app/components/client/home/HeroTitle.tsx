"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useIntroCue } from "@/app/components/common/introCue";

// hero heading: each line sits below its own mask and slides up into place, one after another,
// once the intro hands over to the hero
const HeroTitle = ({ text, className = "" }: { text: string; className?: string }) => {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const play = useIntroCue();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !play) return;
    const lines = root.querySelectorAll("[data-line]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(lines, { y: 0 });
      return;
    }
    const tween = gsap.to(lines, { y: 0, duration: 1.1, ease: "power3.out", stagger: 0.13 });
    return () => {
      tween.kill();
    };
  }, [play]);

  return (
    <h1 ref={rootRef} aria-label={text} className={className}>
      {text.split("\n").map((line) => (
        <span key={line} aria-hidden="true" className="block overflow-hidden">
          {/* starts a little more than its own height down, fully under the mask; gsap reads this as its starting y */}
          <span data-line className="block" style={{ transform: "translateY(108%)" }}>
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
};

export default HeroTitle;
