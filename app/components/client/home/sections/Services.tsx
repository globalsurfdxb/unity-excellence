"use client";

import { useState } from "react";
import Image from "next/image";
import { servicesData } from "../data";

type Props = {
  data: typeof servicesData;
};

const Services = ({ data }: Props) => {
  const [active, setActive] = useState(0);

  return (
    <section className="py-130">
      <div className="container">
        <div className="relative flex flex-col overflow-hidden rounded-[10px] lg:aspect-[2.15] lg:flex-row">
          <Image src={data.background} alt="" fill className="object-cover" />

          <div className="relative aspect-[4/3] lg:aspect-auto lg:w-[48.84%]">
            {data.services.map((service, i) => (
              <Image
                key={service.title}
                src={service.image}
                alt={service.title}
                fill
                className={`object-cover pointer-events-none transition-opacity rounded-[10px] duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>

          <div className="relative flex flex-1 flex-col justify-between pl-70 py-70 3xl:py-100">
            <Image
              src={data.bgShape}
              alt=""
              width={311}
              height={554}
              className="pointer-events-none absolute right-0 top-1/2 h-[63%] 3xl:h-[69%] w-auto -translate-y-1/2"
            />
            <div className="relative">
              <h2 className="section-title text-white">{data.title}</h2>
              <p className="text-description mt-20 max-w-[35ch] text-white/70">{data.description}</p>
            </div>

            <ul className="relative flex flex-col gap-30">
              {data.services.map((service, i) => {
                const isActive = i === active;
                return (
                  <li key={service.title}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className={`flex cursor-pointer items-center gap-20 text-left text-subtitle transition-colors duration-400 ${isActive ? "text-white" : "text-white/20"}`}
                    >
                      {service.title}
                      <span
                        className={`flex size-[32px] shrink-0 items-center justify-center rounded-full bg-white text-primary transition-opacity duration-400 ${isActive ? "opacity-100" : "opacity-0"}`}
                      >
                        <Image
                          src="/assets/icons/common/right-top-arrow-primary.svg"
                          alt=""
                          width={20}
                          height={20}
                          className="h-[12px] w-auto pointer-events-none"
                        />
                      </span>
                    </button>

                    <div
                      className={`grid transition-[grid-template-rows] duration-400 ${isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <p className="text-description max-w-[280px] overflow-hidden text-white/70">
                        <span className="block pt-2 3xl:pt-[11px]">{service.description}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
