"use client";

import { useState } from "react";
import { useLenis } from "lenis/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { footerData } from "./data";
import CommonButton from "./CommonButton";
import SectionTitle from "./SectionTitle";
import EdgeLine from "./EdgeLine";
import { usePressScale } from "./usePressScale";
import { moveUpV4 } from "./motionVariants";
import { useUncovered } from "./useUncovered";
import { motion } from "motion/react";

type Props = {
  data: typeof footerData;
};

const Footer = ({ data }: Props) => {
  const pathname = usePathname();
  const pressScale = usePressScale();
  // top corners only round once the page has scrolled all the way down
  const [atEnd, setAtEnd] = useState(false);
  useLenis(({ scroll, limit }) => setAtEnd(scroll >= limit - 2));
  // the footer sits under the page, so its intro waits until it is actually uncovered
  const [introRef, introShown] = useUncovered<HTMLDivElement>();
  const [navRef, navShown] = useUncovered<HTMLElement>();
  const [socialsRef, socialsShown] = useUncovered<HTMLDivElement>();

  return (
    <footer
      className={`relative overflow-hidden xl:sticky xl:bottom-0 xl:z-0 pt-130 pb-60 min-[1900px]:pb-[66px] transition-[border-radius] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${atEnd ? "rounded-t-[40px]" : "rounded-t-none"}`}
    >
      <Image src={data.background} alt="" fill className="object-cover pointer-events-none" />
      <div className="container pointer-events-none absolute inset-x-0 top-0">
        <Image src={data.bgShape} alt="" width={542} height={333} className="pointer-events-none ml-auto block h-auto max-w-[36%] 3xl:max-w-[60%] opacity-60" />
      </div>

      <div className="container relative">
        <div className="grid gap-x-40 gap-y-40 lg:grid-cols-[1fr_1fr_auto] 3xl:grid-cols-[1.2fr_1fr_auto] lg:items-center">
          {/* row 1 */}
          <div ref={introRef} className="lg:self-start">
            <SectionTitle text={data.title} className="section-title text-white max-3xl:max-w-[20ch]" />
            <motion.p
              initial="hidden"
              animate={introShown ? "show" : "hidden"}
              variants={moveUpV4(0.15)}
              className="text-description mt-20 max-w-[40ch] text-white/70"
            >
              {data.description}
            </motion.p>
            <motion.div
              initial="hidden"
              animate={introShown ? "show" : "hidden"}
              variants={moveUpV4(0.35)}
              className="mt-40"
            >
              <CommonButton label={data.button.label} href={data.button.href} />
            </motion.div>
          </div>
          <div className="lg:col-span-2 lg:self-start mt-3">
            <motion.a
              href={`tel:${data.contact.phone.replace(/\s/g, "")}`}
              initial="hidden"
              animate={introShown ? "show" : "hidden"}
              variants={moveUpV4(0.25)}
              className="text-subtitle block text-white w-fit"
            >
              {data.contact.phone}
            </motion.a>
            <motion.a
              href={`mailto:${data.contact.email}`}
              initial="hidden"
              animate={introShown ? "show" : "hidden"}
              variants={moveUpV4(0.35)}
              className="text-subtitle mt-[10px] block underline text-white w-fit"
            >
              {data.contact.email}
            </motion.a>
            <motion.p
              initial="hidden"
              animate={introShown ? "show" : "hidden"}
              variants={moveUpV4(0.45)}
              className="text-description mt-20 whitespace-pre-line text-white/70 w-fit"
            >
              {data.contact.address}
            </motion.p>
          </div>

          {/* row 2 */}
          <EdgeLine height="h-2.5 3xl:h-3.75" color="border-white/20" direction="center" className="lg:col-span-3" />

          {/* row 3 */}
          {/* shares the links' row, so it rises in on the same uncover */}
          <motion.div initial="hidden" animate={navShown ? "show" : "hidden"} variants={moveUpV4()}>
            <Image src={data.logo} alt="Unity Excellence" width={116} height={103} className="pointer-events-none h-auto w-[110px] 3xl:w-[116px]" />
          </motion.div>

          {/* links start slightly bunched and spread out to their spacing once uncovered, easing just past it before settling */}
          <nav
            ref={navRef}
            className={`flex flex-wrap gap-y-20 transition-[column-gap] duration-[1100ms] ease-[cubic-bezier(0.34,2,0.64,1)] ${navShown ? "gap-x-40 3xl:gap-x-50" : "gap-x-[calc(var(--spacing-40)*0.8)] 3xl:gap-x-[calc(var(--spacing-50)*0.8)]"}`}
          >
            {data.navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-subtitle transition-colors duration-400 hover:text-white ${pathname === link.href ? "text-white" : "text-white/50"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {/* the reverse of the links: icons start slightly spread and close in, easing just past their gap before settling */}
          <div
            ref={socialsRef}
            className={`flex transition-[gap] duration-[1100ms] ease-[cubic-bezier(0.34,2,0.64,1)] ${socialsShown ? "gap-2.5" : "gap-4"}`}
          >
            {data.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                {...pressScale}
                className="group relative isolate flex size-[48px] items-center justify-center overflow-hidden rounded-full border border-border-color/20"
              >
                {/* on hover one fill drops from the top and one rises from the bottom, meeting in the middle */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 -z-10 h-full translate-y-[-101%] rounded-b-[40%] transition-transform duration-200 ease-linear group-hover:translate-y-[-15%] bg-white"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 -z-10 h-full translate-y-[101%] rounded-t-[40%] transition-transform duration-200 ease-linear group-hover:translate-y-[15%] bg-white"
                />
                {/* icons are navy; shown white until hover */}
                <Image
                  src={social.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="pointer-events-none brightness-0 invert transition-[filter] duration-200 ease-linear group-hover:brightness-100 group-hover:invert-0"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-100 flex flex-col-reverse gap-20 text-description-2 text-white/40 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-40 gap-y-[10px]">
            {data.legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="transition-colors duration-400 hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
          <p>{data.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
