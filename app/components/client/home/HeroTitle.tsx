"use client";

import SectionTitle from "@/app/components/common/SectionTitle";
import { useIntroCue } from "@/app/components/common/introCue";

// hero heading: hidden until the intro hands over to the hero, then plays the section title animation
const HeroTitle = ({ text, className }: { text: string; className?: string }) => {
  const play = useIntroCue();
  return <SectionTitle text={text} tag="h1" play={play} startOpacity={0} className={className} />;
};

export default HeroTitle;
