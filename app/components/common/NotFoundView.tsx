"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { notFoundData } from "./data";
import { introLogo } from "./introLogo";
import CommonButton from "./CommonButton";
import SectionTitle from "./SectionTitle";

// the mark's own box inside the full logo's viewBox, so it can stand in for the "0"
const MARK_VIEWBOX = "39 -1 42 38";

// full-screen 404: edge-glow shapes settle in, the two 4s rise out of their lines while the brand mark
// fades in piece by piece between them as the 0, then the title plays and the copy and button follow
const NotFoundView = () => {
  const rootRef = useRef<HTMLElement>(null);
  const [titlePlay, setTitlePlay] = useState(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const pieces = gsap.utils.toArray<SVGPathElement>('[data-nf="piece"]');

      gsap.set('[data-nf="digit"]', { yPercent: 110 });
      gsap.set(pieces, { opacity: 0 });
      gsap.set('[data-nf="fade"]', { opacity: 0, y: 16 });
      gsap.set('[data-nf="button"]', { opacity: 0, y: 50 });

      gsap.timeline({ delay: 0.15 })
        // from() so each shape fades up to its own CSS opacity
        .from('[data-nf="shape"]', { opacity: 0, scale: 1.08, duration: 1.8, ease: "power2.out", stagger: 0.2 }, 0)
        .to('[data-nf="digit"]', { yPercent: 0, duration: 1.2, ease: "power4.out", stagger: 0.14 }, 0.2)
        .to(pieces, { opacity: 1, duration: 0.45, ease: "power2.out", stagger: { each: 0.025, from: "random" } }, 0.3)
        // once all pieces are in, the mark turns slowly
        .add(() => {
          gsap.to('[data-nf="zero"]', { rotation: 360, duration: 40, ease: "none", repeat: -1 });
        })
        .call(() => setTitlePlay(true), [], 1.5)
        .to('[data-nf="fade"]', { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.12 }, 1.6)
        .to('[data-nf="button"]', { y: 0, duration: 1.4, ease: "elastic.out(1.1, 0.6)" }, 1.9)
        .to('[data-nf="button"]', { opacity: 1, duration: 0.4, ease: "power2.out" }, 1.9);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={rootRef}
      className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-linear-[255.44deg] from-primary from-[56.21%] to-primary-light to-[154.81%] px-20 py-100 text-center text-white"
    >
      {/* edge-glow shapes placed as on the rest of the site: the footer's at the top right, the hero's along the bottom edge at the left */}
      <Image
        src={notFoundData.shapes.primary}
        alt=""
        width={542}
        height={333}
        data-nf="shape"
        className="pointer-events-none absolute top-0 right-0 -z-10 h-auto max-w-[60%] lg:max-w-[30%] 3xl:max-w-[36%] opacity-60"
      />

      <p data-nf="fade" className="text-description-2 tracking-[0.3em] uppercase text-white/60">
        {notFoundData.eyebrow}
      </p>

      <div aria-hidden="true" className="mt-30 flex items-center leading-none text-[clamp(120px,24vw,360px)] tracking-[-0.04em]">
        <span className="block overflow-hidden pb-[0.04em]">
          <span data-nf="digit" className="block">4</span>
        </span>
        <span data-nf="zero" className="mx-[0.08em] block">
          <svg viewBox={MARK_VIEWBOX} fill="white" className="block h-[0.62em] w-auto overflow-visible">
            <g>
              {introLogo.mark.map((d) => (
                <path key={d} d={d} data-nf="piece" />
              ))}
            </g>
          </svg>
        </span>
        <span className="block overflow-hidden pb-[0.04em]">
          <span data-nf="digit" className="block">4</span>
        </span>
      </div>

      <SectionTitle text={notFoundData.title} tag="h1" play={titlePlay} startOpacity={0} className="section-title mt-40" />
      <p data-nf="fade" className="text-description mt-20 max-w-[44ch] text-white/70">
        {notFoundData.description}
      </p>
      <div data-nf="button" className="mt-40">
        <CommonButton label={notFoundData.button.label} href={notFoundData.button.href} />
      </div>
    </main>
  );
};

export default NotFoundView;
