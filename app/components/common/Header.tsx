"use client";

import { useState } from "react";
import { useLenis } from "lenis/react";
import Image from "next/image";
import Link from "next/link";
import { headerData } from "./data";
import CommonButton from "./CommonButton";
import { usePressScale } from "./usePressScale";

type Props = {
  data: typeof headerData;
};

const Header = ({ data }: Props) => {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pressScale = usePressScale();

  // hide while scrolling down, show again on scroll up
  useLenis(({ scroll, direction }) => {
    setScrolled(scroll > 150);
    if (direction === 1 && scroll > 150) setHidden(true);
    if (direction === -1) setHidden(false);
  });

  // white bar only while the header is showing mid-page, not while it slides away
  const solid = scrolled && !hidden;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[translate,background-color,padding,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${hidden ? "-translate-y-full" : "translate-y-0"} ${solid ? "bg-white py-20 shadow-[0_4px_20px_rgba(21,38,99,0.06)]" : "pt-50"}`}
    >
      {/* below md: logo left, hamburger right, no button */}
      <div className="container flex items-center justify-between md:grid md:grid-cols-3">
        <button
          type="button"
          aria-label="Open menu"
          {...pressScale}
          className="group relative isolate order-last flex size-[50px] cursor-pointer items-center justify-center justify-self-start overflow-hidden rounded-full border border-border-color md:order-none"
        >
          {/* drops in from the top on hover, in the colour opposite the bar behind it */}
          <span
            aria-hidden="true"
            className={`absolute inset-x-0 top-0 -z-10 h-[200%] -translate-y-[101%] rounded-b-[30%] transition-transform duration-400 ease-linear group-hover:translate-y-0 ${solid ? "bg-primary" : "bg-white"}`}
          />
          {/* icon is navy; white over the hero, and flips against the hover fill */}
          <Image
            src="/assets/icons/common/hamburger.svg"
            alt=""
            width={20}
            height={15}
            className={`pointer-events-none transition-[filter] duration-300 ease-linear ${solid ? "group-hover:brightness-0 group-hover:invert" : "brightness-0 invert group-hover:brightness-100 group-hover:invert-0"}`}
          />
        </button>

        <Link href="/" aria-label="Unity Excellence home" className="justify-self-center">
          <Image src={data.logo} alt="Unity Excellence" width={128} height={114} preload
            className={`h-auto pointer-events-none transition-[width,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${solid ? "w-[70px] lg:w-[100px]" : "w-[90px] brightness-0 invert lg:w-[128px]"}`}
          />
        </Link>

        <CommonButton
          label={data.button.label}
          href={data.button.href}
          variant={solid ? "dark" : "light"}
          className="justify-self-end max-md:hidden"
        />
      </div>
    </header>
  );
};

export default Header;
