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
          data-intro="header-end"
          {...pressScale}
          className="group relative isolate order-last flex size-(--btn-size) cursor-pointer items-center justify-center justify-self-start overflow-hidden rounded-full border border-border-color md:order-none"
        >
          {/* on hover one fill drops from the top and one rises from the bottom, meeting in the middle,
              in the colour opposite the bar behind it */}
          <span
            aria-hidden="true"
            className={`absolute inset-x-0 top-0 -z-10 h-full translate-y-[-101%] rounded-b-[40%] transition-transform duration-200 ease-linear group-hover:translate-y-[-15%] ${solid ? "bg-primary" : "bg-white"}`}
          />
          <span
            aria-hidden="true"
            className={`absolute inset-x-0 bottom-0 -z-10 h-full translate-y-[101%] rounded-t-[40%] transition-transform duration-200 ease-linear group-hover:translate-y-[15%] ${solid ? "bg-primary" : "bg-white"}`}
          />
          {/* icon is navy; white over the hero, and flips against the hover fill */}
          <Image
            src="/assets/icons/common/hamburger.svg"
            alt=""
            width={20}
            height={15}
            className={`pointer-events-none transition-[filter] duration-200 ease-linear ${solid ? "group-hover:brightness-0 group-hover:invert" : "brightness-0 invert group-hover:brightness-100 group-hover:invert-0"}`}
          />
        </button>

        <Link href="/" aria-label="Unity Excellence home" data-intro="header-logo" className="justify-self-center">
          <Image src={data.logo} alt="Unity Excellence" width={129} height={114} preload
            className={`h-auto pointer-events-none transition-[width,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${solid ? "w-[70px] lg:w-[80px] 2xl:w-[90px] 3xl:w-[100px]" : "w-[80px] brightness-0 invert lg:w-[100px] 2xl:w-[110px] 2xl:h-[104px] 3xl:w-[128.44px] 3xl:h-[114px]"}`}
          />
        </Link>

        <div data-intro="header-end" className="justify-self-end max-md:hidden">
          <CommonButton label={data.button.label} href={data.button.href} variant={solid ? "dark" : "light"} />
        </div>
      </div>
    </header>
  );
};

export default Header;
