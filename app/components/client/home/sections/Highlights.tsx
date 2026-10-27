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

type Props = {
  data: typeof highlightsData;
};

const pad = (n: number) => String(n).padStart(2, "0");

const Highlights = ({ data }: Props) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [active, setActive] = useState(0);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const bar = useRef<HTMLDivElement>(null);
  const total = data.slides.length;

  // play only the active video and fill the line with its progress
  useEffect(() => {
    videos.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });

    let frame: number;
    const tick = () => {
      const video = videos.current[active];
      if (video?.duration && bar.current) {
        bar.current.style.transform = `scaleX(${video.currentTime / video.duration})`;
      }
      frame = requestAnimationFrame(tick);
    };
    tick();

    return () => cancelAnimationFrame(frame);
  }, [active]);

  return (
    <section className="relative h-[88.5vh] overflow-hidden">
      {data.slides.map((slide, i) => (
        <video
          key={i}
          ref={(el) => {
            videos.current[i] = el;
          }}
          src={slide.video}
          muted
          playsInline
          preload="metadata"
          onEnded={() => (i === total - 1 ? swiper?.slideTo(0) : swiper?.slideNext())}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-black/50" />

      <div className="container relative flex h-full flex-col justify-center">
        <div className="flex gap-2">
          <NavButton direction="prev" onClick={() => swiper?.slidePrev()} disabled={active === 0} />
          <NavButton direction="next" onClick={() => swiper?.slideNext()} disabled={active === total - 1} />
        </div>
        <div className="mt-60 h-px bg-white/25">
          <div ref={bar} className="h-full origin-left bg-white" style={{ transform: "scaleX(0)" }} />
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
                <SectionTitle text={slide.title} play={i === active} className="section-title text-white" />
                <div>
                  <span className="inline-block rounded-full bg-primary px-[17.5px] py-3 3xl:min-w-[86px] text-[20px] text-white max-h-[38px] text-trim">
                    {pad(i + 1)}/
                    <span className="text-white/40">{pad(total)}</span>
                  </span>
                  <h3 className="text-subtitle mt-20 max-w-[22ch] text-white">{slide.subtitle}</h3>
                  <p className="text-description mt-20 max-w-[35ch] text-white/70">{slide.description}</p>
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
