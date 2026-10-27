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

const BLUR = 8;

const ParallaxImage = ({ src, alt, offset, fade = false }: ParallaxImageProps) => {
  const ref = useRef<HTMLDivElement>(null);
  // drifts from +offset to -offset for as long as the image is on screen
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(pass, [0, 1], [offset, -offset]);
  // blurred and faded as it enters, fully clear once it reaches the middle of the screen
  const { scrollYProgress: focus } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const blurAmount = useTransform(focus, [0, 1], [BLUR, 0]);
  const filter = useMotionTemplate`blur(${blurAmount}px)`;
  const fadeOpacity = useTransform(focus, [0, 1], [0.7, 0]);

  return (
    <motion.div ref={ref} style={{ y, filter }} className="relative size-[100px] overflow-hidden rounded-[10px] will-change-transform xl:size-150">
      <Image src={src} alt={alt} fill sizes="150px" className="object-cover" />
      {/* fade moves with the image */}
      {fade && <motion.div style={{ opacity: fadeOpacity }} className="absolute inset-x-0 bottom-0 h-[85%] bg-linear-to-b from-background/0 to-background" />}
    </motion.div>
  );
};

// starting offset (px) per image: top-left, top-right, bottom-left, bottom-right
const OFFSETS = [90, 140, 120, 70];

// text rises in from below, top-down: title, then description, then button
const RISE = 40;
const ELASTIC = { type: "spring", stiffness: 260, damping: 14 } as const;
// slower and softer than the button's spring, so the larger title glides in
const TITLE_ELASTIC = { type: "spring", stiffness: 120, damping: 10 } as const;
const SMOOTH = { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const;
const reveal = (shown: boolean, delay: number, transition: typeof ELASTIC | typeof TITLE_ELASTIC | typeof SMOOTH) => ({
  initial: { y: RISE, opacity: 0 },
  animate: shown ? { y: 0, opacity: 1 } : undefined,
  transition: { ...transition, delay },
});

const About = ({ data }: Props) => {
  const [topRow, bottomRow] = [data.images.slice(0, 2), data.images.slice(2, 4)];
  const textRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const { scrollY } = useScroll();

  // the text sits over the image grid, so wait until its middle is well on screen rather than its first pixel
  const check = () => {
    if (shown || !textRef.current) return;
    const { top, height } = textRef.current.getBoundingClientRect();
    if (top + height / 2 < window.innerHeight * 0.85) setShown(true);
  };
  useMotionValueEvent(scrollY, "change", check);
  // covers a reload that restores the page mid-scroll
  useEffect(() => check(), []); // eslint-disable-line react-hooks/exhaustive-deps

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
          <motion.h2 {...reveal(shown, 0, TITLE_ELASTIC)} className="section-title max-w-[30ch] bg-linear-[var(--gradient-angle)] from-primary from-[21.05%] to-primary-light to-[84.98%] animate-gradient-wave bg-clip-text text-transparent">
            {data.title}
          </motion.h2>
          <motion.p {...reveal(shown, 0.2, SMOOTH)} className="text-description mt-20 mb-40 max-w-[48ch] text-secondary">
            {data.description}
          </motion.p>
          <motion.div {...reveal(shown, 0.4, ELASTIC)}>
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

export default About;
