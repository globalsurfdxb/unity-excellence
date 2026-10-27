"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { servicesData } from "../data";
import SectionTitle from "@/app/components/common/SectionTitle";

type Props = {
  data: typeof servicesData;
};

const Services = ({ data }: Props) => {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // starts full-bleed (edge to edge, no padding, square corners) and settles into the container
  // on entering the viewport; the card overflows into the section padding, so nothing below shifts
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    if (!section || !card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {});
    let height = 0;

    // measured from the settled layout each time, so a late scrollbar or a resize can't leave it too wide
    const bleed = () => {
      gsap.set(card, { clearProps: "margin,height,aspectRatio" });
      const py = parseFloat(getComputedStyle(section).paddingTop);
      const rect = card.getBoundingClientRect();
      height = rect.height;
      ctx.add(() => {
        gsap.set(card, {
          marginLeft: -rect.left,
          marginRight: -(document.documentElement.clientWidth - rect.right),
          marginTop: -py,
          marginBottom: -py,
          height: height + 2 * py,
          // with a fixed height, aspect-ratio would derive the width from it and push the card off screen
          aspectRatio: "auto",
          "--radius": "0px",
        });
      });
    };
    bleed();
    window.addEventListener("resize", bleed);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        bleed();
        window.removeEventListener("resize", bleed);
        ctx.add(() => {
          gsap.to(card, {
            marginLeft: 0,
            marginRight: 0,
            marginTop: 0,
            marginBottom: 0,
            height,
            "--radius": "10px",
            duration: 1.2,
            ease: "power3.inOut",
            clearProps: "margin,height,aspectRatio,--radius",
          });
        });
      },
      { rootMargin: "0px 0px -25% 0px" },
    );
    observer.observe(section);

    return () => {
      window.removeEventListener("resize", bleed);
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="overflow-x-clip py-130">
      <div className="container">
        <div ref={cardRef} className="relative flex flex-col overflow-hidden rounded-(--radius,10px) lg:aspect-[2.15] lg:flex-row">
          <Image src={data.background} alt="" fill className="object-cover" />

          <div className="relative aspect-[4/3] lg:aspect-auto lg:w-[48.84%]">
            {data.services.map((service, i) => (
              <Image
                key={service.title}
                src={service.image}
                alt={service.title}
                fill
                className={`object-cover pointer-events-none transition-opacity rounded-(--radius,10px) duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}
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
              <SectionTitle text={data.title} className="section-title text-white" />
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
