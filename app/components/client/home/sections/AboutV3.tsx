"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionTemplate, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { aboutData } from "../data";
import CommonButton from "@/app/components/common/CommonButton";

type Props = {
  data: typeof aboutData;
};

type ParallaxImageProps = {
  src: string;
  alt: string;
  offset: number;
  fade?: boolean;
};

// screens of scroll over which an image travels from +offset to -offset
const TRAVEL = 2.25;
const BLUR = 8;

// also runs during server render, where there is no window
const screenHeight = () => (typeof window === "undefined" ? 1 : window.innerHeight);

const ParallaxImage = ({ src, alt, offset, fade = false }: ParallaxImageProps) => {
  const { scrollY } = useScroll();

  // keeps drifting the whole time the section is on screen, not only until it settles
  const y = useTransform(scrollY, (v) => {
    const progress = Math.min(v / (screenHeight() * TRAVEL), 1);
    return offset * (1 - 2 * progress);
  });
  // sharpens while the hero scrolls away
  const blurAmount = useTransform(scrollY, (v) => BLUR * (1 - Math.min(v / screenHeight(), 1)));
  const filter = useMotionTemplate`blur(${blurAmount}px)`;

  return (
    <motion.div style={{ y, filter }} className="relative size-[100px] overflow-hidden rounded-[10px] will-change-transform xl:size-150">
      <Image src={src} alt={alt} fill sizes="150px" className="object-cover" />
      {/* fade moves with the image */}
      {fade && <div className="absolute inset-x-0 bottom-0 h-[85%] bg-linear-to-b from-background/0 to-background opacity-70" />}
    </motion.div>
  );
};

// starting offset (px) per image: top-left, top-right, bottom-left, bottom-right
const OFFSETS = [90, 140, 120, 70];

// text drops in from above, bottom-up: button, then description, then title
const DROP = -40;
const ELASTIC = { type: "spring", stiffness: 260, damping: 14 } as const;
// slower and softer than the button's spring, so the larger title glides in
const TITLE_ELASTIC = { type: "spring", stiffness: 120, damping: 10 } as const;
const SMOOTH = { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const;
const reveal = (shown: boolean, delay: number, transition: typeof ELASTIC | typeof TITLE_ELASTIC | typeof SMOOTH) => ({
  initial: { y: DROP, opacity: 0 },
  animate: shown ? { y: 0, opacity: 1 } : undefined,
  transition: { ...transition, delay },
});

// matches the hero height in HeroV2.tsx: calc(100svh - 19px)
const HERO_GAP = 19;

const AboutV3 = ({ data }: Props) => {
  const [topRow, bottomRow] = [data.images.slice(0, 2), data.images.slice(2, 4)];
  const textRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const { scrollY } = useScroll();

  // the text sits under the hero curtain, so "in view" fires too early;
  // wait until the hero's bottom edge has passed the middle of the text
  const check = (scroll: number) => {
    if (shown || !textRef.current) return;
    const { top, height } = textRef.current.getBoundingClientRect();
    const middle = top + height / 2;
    const heroBottom = window.innerHeight - HERO_GAP - scroll;
    if (heroBottom < middle && middle < window.innerHeight) setShown(true);
  };
  useMotionValueEvent(scrollY, "change", check);
  // covers a reload that restores the page mid-scroll
  useEffect(() => check(scrollY.get()), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="py-130">
      <div className="container relative">
        <div className="relative">
          <div className="flex justify-between px-80">
            {topRow.map((image, i) => (
              <ParallaxImage key={image.src} src={image.src} alt={image.alt} offset={OFFSETS[i]} />
            ))}
          </div>
          <div className="mt-60 flex justify-between">
            {bottomRow.map((image, i) => (
              <ParallaxImage key={image.src} src={image.src} alt={image.alt} offset={OFFSETS[i + 2]} fade />
            ))}
          </div>
        </div>

        <div ref={textRef} className="mt-60 flex flex-col items-center text-center lg:absolute lg:inset-0 lg:mt-0">
          <motion.h2 {...reveal(shown, 0.4, TITLE_ELASTIC)} className="section-title max-w-[30ch] bg-linear-[var(--gradient-angle)] from-primary from-[21.05%] to-primary-light to-[84.98%] animate-gradient-wave bg-clip-text text-transparent">
            {data.title}
          </motion.h2>
          <motion.p {...reveal(shown, 0.2, SMOOTH)} className="text-description mt-20 mb-40 max-w-[48ch] text-secondary">
            {data.description}
          </motion.p>
          <motion.div {...reveal(shown, 0, ELASTIC)}>
            <CommonButton
              label={data.button.label}
              href={data.button.href}
              variant="dark"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutV3;
