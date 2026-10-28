"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { servicesData } from "../data";
import SectionTitle from "@/app/components/common/SectionTitle";
import { moveUp } from "@/app/components/common/motionVariants";
import { motion } from "motion/react";

type Props = {
  data: typeof servicesData;
};

// the wipe's moving edge is an arc whose middle trails this far (% of the image height) below its sides;
// the arc is a polygon traced along a sine, its height read from --edge so GSAP only has to tween one number
const CURVE = 6;
const ARC_POINTS = 24;
const WIPE_CLIP = `polygon(0% 0%, 100% 0%, ${Array.from({ length: ARC_POINTS + 1 }, (_, i) => {
  const x = 100 - (i * 100) / ARC_POINTS;
  return `${x}% calc(var(--edge) * 1% + ${(CURVE * Math.sin((Math.PI * x) / 100)).toFixed(2)}%)`;
}).join(", ")})`;

const Services = ({ data }: Props) => {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const shownRef = useRef(0);

  // on a new service the current image is clipped away from the bottom up behind a curved edge, uncovering the new one underneath;
  // a wipe still running stays on top of the one just started, so quick hovers stack instead of jumping
  useEffect(() => {
    const images = imagesRef.current;
    const outgoing = images[shownRef.current];
    const incoming = images[active];
    if (shownRef.current === active || !outgoing || !incoming) return;
    shownRef.current = active;

    gsap.killTweensOf(incoming);
    images.forEach((image) => {
      if (!image || image === outgoing || image === incoming) return;
      if (gsap.isTweening(image)) gsap.set(image, { zIndex: Number(image.style.zIndex) + 1 });
      else gsap.set(image, { visibility: "hidden", zIndex: 0 });
    });
    gsap.set(incoming, { visibility: "visible", zIndex: 0 });
    incoming.style.clipPath = "";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(outgoing, { visibility: "hidden" });
      return;
    }
    // set directly: GSAP would try to parse the var() inside the polygon
    gsap.set(outgoing, { zIndex: 1 });
    outgoing.style.clipPath = WIPE_CLIP;
    // starts with the sides of the arc at the bottom, ends with its middle at the top
    gsap.fromTo(
      outgoing,
      { "--edge": 100 },
      {
        "--edge": -CURVE,
        duration: 1.2,
        // a gentler curve than power3, so the edge never rushes through the middle
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(outgoing, { visibility: "hidden", zIndex: 0 });
          outgoing.style.clipPath = "";
        },
      },
    );
  }, [active]);

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
        <div ref={cardRef} className="relative flex flex-col overflow-hidden rounded-(--radius,10px) lg:aspect-[2] lg:flex-row 2xl:aspect-[2.15] 3xl:h-[801px]">
          <Image src={data.background} alt="" fill className="object-cover" />

          <div className="relative aspect-[4/3] overflow-hidden rounded-(--radius,10px) lg:aspect-auto lg:w-[48.84%]">
            <div className="absolute inset-0">
              {data.services.map((service, i) => (
                <Image
                  key={service.title}
                  ref={(el) => {
                    imagesRef.current[i] = el;
                  }}
                  src={service.image}
                  alt={service.title}
                  fill
                  className={`object-cover pointer-events-none ${i === 0 ? "" : "invisible"}`}
                />
              ))}
            </div>
          </div>

          <div className="relative flex flex-1 flex-col justify-between pl-70 py-50 xl:py-70 3xl:py-100">
            <Image
              src={data.bgShape}
              alt=""
              width={311}
              height={553}
              className="pointer-events-none absolute right-0 top-1/2 h-[63%] 3xl:h-[69%] w-auto -translate-y-1/2"
            />
            <div className="relative">
              <SectionTitle text={data.title} className="section-title text-white" />
              <motion.p
                initial="hidden"
                whileInView="show"
                variants={moveUp(0.07)}
                className="text-description mt-20 max-w-[35ch] text-white/70"
              >
                {data.description}
              </motion.p>
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
                      className={`flex cursor-pointer items-center gap-20 text-left text-subtitle transition-colors duration-400 ${isActive ? "text-white font-neue-montreal-medium" : "text-white/20"}`}
                    >
                      {service.title}
                      <span
                        className={`flex size-[28px] 3xl:size-[32px] shrink-0 items-center justify-center rounded-full bg-white text-primary transition-opacity duration-400 ${isActive ? "opacity-100" : "opacity-0"}`}
                      >
                        <Image
                          src="/assets/icons/common/right-top-arrow-primary.svg"
                          alt=""
                          width={20}
                          height={20}
                          className="h-2.5 3xl:h-[12px] w-auto pointer-events-none"
                        />
                      </span>
                    </button>

                    <div
                      className={`grid transition-[grid-template-rows] duration-400 ${isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <p className="text-description max-w-[280px] overflow-hidden text-white/70">
                        <span className="block pt-1 xl:pt-2 3xl:pt-[11px]">{service.description}</span>
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
