"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { newsData } from "../data";
import CommonButton from "@/app/components/common/CommonButton";
import NewsCard from "@/app/components/common/NewsCard";

type Props = {
  data: typeof newsData;
};

const News = ({ data }: Props) => {
  return (
    <section className="py-130">
      <div className="container">
        <div className="flex items-center justify-between gap-20">
          <h2 className="section-title">{data.title}</h2>
          <CommonButton
            label={data.button.label}
            href={data.button.href}
            variant="dark"
          />
        </div>

        <Swiper
          slidesPerView={1.2}
          spaceBetween={20}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
            1280: { slidesPerView: 4, spaceBetween: 30 },
            1780: { slidesPerView: 4, spaceBetween: 32 },
          }}
          className="mt-50"
        >
          {data.news.map((item) => (
            <SwiperSlide key={item.title} className="h-auto!">
              <NewsCard {...item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default News;
