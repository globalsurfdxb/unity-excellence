"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { newsData } from "../data";
import CommonButton from "@/app/components/common/CommonButton";
import NewsCard from "@/app/components/common/NewsCard";
import SectionTitle from "@/app/components/common/SectionTitle";

type Props = {
  data: typeof newsData;
};

const News = ({ data }: Props) => {
  const listRef = useRef<HTMLDivElement>(null);

  // cards rise in one after another: the image wipes up while zooming out, then the text follows
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-news="card"]');
      gsap.set(cards, { y: 120, rotate: 3, opacity: 0, transformOrigin: "0% 100%" });
      gsap.set('[data-news="media"]', { "--clip": "100%" });
      gsap.set('[data-news="zoom"]', { scale: 1.35 });
      gsap.set('[data-news="content"]', { y: 30, opacity: 0 });

      const tl = gsap.timeline({ paused: true });
      cards.forEach((card, i) => {
        const at = i * 0.14;
        tl.to(card, { y: 0, rotate: 0, opacity: 1, duration: 1.2, ease: "power4.out", clearProps: "transform,opacity" }, at)
          .to(card.querySelector('[data-news="media"]'), { "--clip": "0%", duration: 1.2, ease: "power4.inOut", clearProps: "--clip" }, at)
          .to(card.querySelector('[data-news="zoom"]'), { scale: 1, duration: 1.6, ease: "power3.out", clearProps: "transform" }, at)
          .to(card.querySelectorAll('[data-news="content"]'), { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1, clearProps: "transform,opacity" }, at + 0.45);
      });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          tl.play();
        },
        { rootMargin: "0px 0px -20% 0px" },
      );
      observer.observe(list);
      return () => observer.disconnect();
    }, list);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-130">
      <div className="container">
        <div className="flex items-center justify-between gap-20">
          <SectionTitle text={data.title} className="section-title" />
          <CommonButton
            label={data.button.label}
            href={data.button.href}
            variant="dark"
          />
        </div>

        <div ref={listRef} className="mt-50">
          <Swiper
            slidesPerView={1.2}
            spaceBetween={20}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 30 },
              1780: { slidesPerView: 4, spaceBetween: 32 },
            }}
          >
            {data.news.map((item) => (
              <SwiperSlide key={item.title} className="h-auto!">
                <NewsCard {...item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default News;
