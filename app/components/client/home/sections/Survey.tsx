"use client";

import { useRef } from "react";
import Image from "next/image";
import { surveyData } from "../data";
import CommonButton from "@/app/components/common/CommonButton";
import SectionTitle from "@/app/components/common/SectionTitle";
import { useParallax } from "@/app/components/common/useParallax";
import { moveUp } from "@/app/components/common/motionVariants";
import { motion } from "motion/react";

type Props = {
  data: typeof surveyData;
};

const Survey = ({ data }: Props) => {
  const mediaRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  // image drifts against the scroll inside its clipped frame
  useParallax(mediaRef, parallaxRef);

  return (
    <section className="grid lg:min-h-[calc(50vw*668/960)] lg:grid-cols-2">
      <div ref={mediaRef} className="relative isolate z-10 aspect-[960/668] overflow-hidden lg:aspect-auto lg:rounded-r-[10px]">
        <div ref={parallaxRef} className="absolute inset-x-0 -top-[8%] h-[116%] will-change-transform">
          <Image src={data.image} alt={data.imageAlt} fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-linear-[238.59deg] from-primary/0 from-[22.02%] to-primary/60 to-100%" />
      </div>

      <div className="flex flex-col justify-center lg:-ml-[15px] bg-linear-[255.44deg] from-primary from-[56.21%] to-primary-light to-[154.81%] pl-20 py-100 text-white pr-30 lg:pl-120 3xl:pl-[135px]">
        <SectionTitle text={data.title} className="hero-title" />
        <motion.p
          initial="hidden"
          whileInView="show"
          variants={moveUp(0.07)}
          className="text-description mt-20 max-w-[40ch] text-white/70"
        >
          {data.description}
        </motion.p>
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={moveUp(0.15)}
          className="mt-40"
          >
          <CommonButton label={data.button.label} href={data.button.href} />
        </motion.div>
      </div>
    </section>
  );
};

export default Survey;
