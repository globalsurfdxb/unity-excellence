import Image from "next/image";
import { heroData } from "../data";
import CommonButton from "@/app/components/common/CommonButton";
import HeroTitle from "../HeroTitle";

type Props = {
  data: typeof heroData;
};

const Hero = ({ data }: Props) => {
  return (
    <section className="relative z-10 h-[calc(100svh-19px)] overflow-hidden rounded-b-[20px] xl:rounded-b-[40px]">
      <Image
        src={data.image}
        alt={data.imageAlt}
        fill
        data-intro="hero"
        loading="eager"
        fetchPriority="high"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/30 bg-linear-to-b from-black/80 to-transparent to-[61.87%]" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent from-50% to-black/80" />
      <Image
        src={data.bgShape}
        alt=""
        data-intro="hero-shape"
        width={536}
        height={260}
        className="absolute -bottom-0 right-150 h-auto max-w-[33%] 3xl:max-w-[50%]"
      />

      <div className="container relative flex h-full flex-col justify-end pb-130">
        <HeroTitle text={data.title} className="hero-title text-white mb-30" />
        <div data-intro="hero-button" className="w-fit">
          <CommonButton label={data.button.label} href={data.button.href} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
