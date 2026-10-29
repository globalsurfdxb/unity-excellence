"use client";

import Image from "next/image";
import { surveyData } from "../data";
import CommonButton from "@/app/components/common/CommonButton";
import SectionTitle from "@/app/components/common/SectionTitle";
import { moveUp } from "@/app/components/common/motionVariants";
import { motion } from "motion/react";

type Props = {
  data: typeof surveyData;
};

const Survey = ({ data }: Props) => {
  return (
    <section className="grid md:min-h-[calc(50vw*668/960)] md:grid-cols-2">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="relative isolate z-10 aspect-[960/668] overflow-hidden bg-linear-[104.56deg] from-primary from-[56.21%] to-primary-light to-[154.81%] md:aspect-auto md:rounded-r-[10px]"
      >
        <motion.div
          variants={{ hidden: { clipPath: "inset(0% 100% 0% 0%)" }, show: { clipPath: "inset(0% 0% 0% 0%)" } }}
          transition={{ duration: 1.25, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0"
        >
          <Image src={data.image} alt={data.imageAlt} fill className="object-cover" />
          <div className="absolute inset-0 bg-linear-[238.59deg] from-primary/0 from-[22.02%] to-primary/60 to-100%" />
        </motion.div>
      </motion.div>

      <div className="flex flex-col justify-center md:-ml-[15px] bg-linear-[255.44deg] from-primary from-[56.21%] to-primary-light to-[154.81%] pl-20 py-100 text-white pr-30 md:pl-100 lg:pl-120 3xl:pl-[135px]">
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
