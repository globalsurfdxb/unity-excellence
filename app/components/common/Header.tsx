"use client";

import { useState } from "react";
import { useLenis } from "lenis/react";
import Image from "next/image";
import Link from "next/link";
import { headerData } from "./data";
import CommonButton from "./CommonButton";

type Props = {
  data: typeof headerData;
};

const Header = ({ data }: Props) => {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      <div className="container grid grid-cols-3 items-center">
        <button
          type="button"
          aria-label="Open menu"
          className="flex size-[50px] cursor-pointer items-center justify-center justify-self-start rounded-full border border-border-color"
        >
          <Image
            src="/assets/icons/common/hamburger.svg"
            alt=""
            width={20}
            height={15}
            className={`pointer-events-none transition-[filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${solid ? "" : "brightness-0 invert"}`}
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
          className="justify-self-end"
        />
      </div>
    </header>
  );
};

export default Header;
