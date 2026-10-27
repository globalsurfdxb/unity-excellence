"use client";

import Image from "next/image";
import { excellenceData } from "../data";
import SectionTitle from "@/app/components/common/SectionTitle";
import EdgeLine from "@/app/components/common/EdgeLine";
import { moveLeft, moveRight, moveUp } from "@/app/components/common/motionVariants";
import { motion } from "motion/react";

type Props = {
  data: typeof excellenceData;
};

const Excellence = ({ data }: Props) => {
  return (
    <section className="bg-cream-background py-130">
      <div className="container flex flex-col lg:flex-row gap-80 lg:justify-between">
        <div>
          <SectionTitle text={data.title} className="section-title" />
          <motion.p
            initial="hidden"
            whileInView="show"
            variants={moveUp(0.07)}
            className="text-description mt-20 max-w-[47ch] text-secondary"
          >
            {data.description}
          </motion.p>
        </div>

        <ul className="grid gap-x-30 sm:grid-cols-2">
          {data.features.map((feature, i) => (
            <li key={feature.title} className="min-[1900px]:min-w-[408px]">
              <EdgeLine delay={i * 0.12} />
              <div className="flex items-center gap-30 pt-30 pb-60 pr-50">
                {/* icon and title close in on each other: icon from the left, title from the right */}
                <motion.div initial="hidden" whileInView="show" variants={moveRight(i * 0.12, 20)} className="flex-shrink-0">
                  <Image
                    src={feature.icon}
                    alt=""
                    width={50}
                    height={50}
                    className="h-[50px] w-auto pointer-events-none"
                  />
                </motion.div>
                <motion.span initial="hidden" whileInView="show" variants={moveLeft(i * 0.12, 20)} className="text-subtitle">
                  {feature.title}
                </motion.span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Excellence;
