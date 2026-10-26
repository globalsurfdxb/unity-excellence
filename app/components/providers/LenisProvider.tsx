"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactLenis root options={{ lerp: 0.1, autoRaf: true }}>
      {children}
    </ReactLenis>
  );
};

export default LenisProvider;
