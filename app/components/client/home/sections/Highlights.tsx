"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import { highlightsData } from "../data";
import NavButton from "@/app/components/common/NavButton";
import SectionTitle from "@/app/components/common/SectionTitle";
import { motion } from "framer-motion";
import { moveUp } from "@/app/components/common/motionVariants";

type Props = {
  data: typeof highlightsData;
};

const pad = (n: number) => String(n).padStart(2, "0");

const Highlights = ({ data }: Props) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  // stays true once the section has first been on screen, so the sources are only attached (and downloaded) from then on
  const [armed, setArmed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const bar = useRef<HTMLDivElement>(null);
  const total = data.slides.length;

  // only play while the section is actually on screen, so the video isn't downloaded on page load.
  // in-viewport isn't enough: on load this section sits under the hero, so also check nothing covers it
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    const check = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const top = Math.max(rect.top, 0);
      const bottom = Math.min(rect.bottom, window.innerHeight);
      const visible =
        bottom > top &&
        [bottom - 1, (top + bottom) / 2].some((y) => {
          const hit = document.elementFromPoint(window.innerWidth / 2, y);
          return !!hit && section.contains(hit);
        });
      setInView(visible);
      if (visible) setArmed(true);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    // IntersectionObserver rather than ScrollTrigger: the home sections sit in a sticky wrapper
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        window.removeEventListener("scroll", onScroll);
        setInView(false);
      }
    });
    observer.observe(section);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // a new slide starts its video from the beginning; the rest stay paused
  useEffect(() => {
    videos.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) video.currentTime = 0;
      else video.pause();
    });
  }, [active]);

  // play the active video while in view and fill the line with its progress; pause and stop the loop when out of view
  useEffect(() => {
    const video = videos.current[active];
    if (!video) return;
    if (!inView) {
      video.pause();
      return;
    }
    video.play().catch(() => {});

    let frame: number;
    const tick = () => {
      if (video.duration && bar.current) {
        bar.current.style.transform = `scaleX(${video.currentTime / video.duration})`;
      }
      frame = requestAnimationFrame(tick);
    };
    tick();

    return () => cancelAnimationFrame(frame);
  }, [active, inView]);

  return (
    <section ref={sectionRef} className="relative h-[88.5vh] overflow-hidden">
      {data.slides.map((slide, i) => (
        <video
          key={i}
          ref={(el) => {
            videos.current[i] = el;
          }}
          src={armed ? slide.video : undefined}
          muted
          playsInline
          preload="metadata"
          onEnded={() =>
            i === total - 1 ? swiper?.slideTo(0) : swiper?.slideNext()
          }
          className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-black/50" />

      <div className="container relative flex h-full flex-col justify-center">
        <div className="flex gap-2">
          <NavButton
            direction="prev"
            onClick={() => swiper?.slidePrev()}
            disabled={active === 0}
          />
          <NavButton
            direction="next"
            onClick={() => swiper?.slideNext()}
            disabled={active === total - 1}
          />
        </div>
        <div className="mt-60 h-px bg-white/25">
          <div
            ref={bar}
            className="h-full origin-left bg-white"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        <Swiper
          modules={[EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          onSwiper={setSwiper}
          onRealIndexChange={(s) => setActive(s.realIndex)}
          className="mt-60 w-full"
        >
          {data.slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="grid gap-30 lg:grid-cols-2">
                {/* replays each time its slide comes in */}
                <SectionTitle
                  text={slide.title}
                  play={i === active}
                  className="section-title text-white"
                />
                <div>
                  <motion.span
                    initial="hidden"
                    whileInView="show"
                    variants={moveUp(0.1)}
                    className="inline-block rounded-full bg-primary px-[17.5px] py-3 3xl:min-w-[86px] text-[20px] text-white max-h-[38px] text-trim"
                  >
                    {pad(i + 1)}/
                    <span className="text-white/40">{pad(total)}</span>
                  </motion.span>
                  <motion.h3
                    initial="hidden"
                    whileInView="show"
                    variants={moveUp(0.2)}
                    className="text-subtitle mt-20 max-w-[22ch] text-white"
                  >
                    {slide.subtitle}
                  </motion.h3>
                  <motion.p
                    initial="hidden"
                    whileInView="show"
                    variants={moveUp(0.3)}
                    className="text-description mt-20 max-w-[35ch] text-white/70"
                  >
                    {slide.description}
                  </motion.p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Highlights;
