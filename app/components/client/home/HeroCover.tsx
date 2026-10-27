"use client";

import { useState } from "react";
import { useLenis } from "lenis/react";

// white layer under the hero; slides down and fades once scrolling starts
const HeroCover = () => {
  const [revealed, setRevealed] = useState(false);

  useLenis(({ scroll }) => setRevealed(scroll > 20));

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 z-[5] h-svh bg-background transition-[translate,opacity] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${revealed ? "translate-y-1/3 opacity-0" : "translate-y-0 opacity-100"}`}
    />
  );
};

export default HeroCover;
