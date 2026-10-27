"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { footerData } from "./data";
import CommonButton from "./CommonButton";
import SectionTitle from "./SectionTitle";
import { usePressScale } from "./usePressScale";

type Props = {
  data: typeof footerData;
};

const Footer = ({ data }: Props) => {
  const pathname = usePathname();
  const pressScale = usePressScale();

  return (
    <footer className="relative overflow-hidden xl:sticky xl:bottom-0 xl:z-0 rounded-t-[40px] pt-130 pb-60 min-[1900px]:pb-[66px]">
      <Image src={data.background} alt="" fill className="object-cover pointer-events-none" />
      <div className="container pointer-events-none absolute inset-x-0 top-0">
        <Image src={data.bgShape} alt="" width={542} height={333} className="pointer-events-none ml-auto block h-auto max-w-[36%] 3xl:max-w-[60%] opacity-60" />
      </div>

      <div className="container relative">
        <div className="grid gap-x-40 gap-y-40 lg:grid-cols-[1fr_1fr_auto] 3xl:grid-cols-[1.2fr_1fr_auto] lg:items-center">
          {/* row 1 */}
          <div className="lg:self-start">
            <SectionTitle text={data.title} className="section-title text-white max-3xl:max-w-[20ch]" />
            <p className="text-description mt-20 max-w-[40ch] text-white/70">{data.description}</p>
            <CommonButton label={data.button.label} href={data.button.href} className="mt-40" />
          </div>
          <div className="lg:col-span-2 lg:self-start mt-3">
            <a href={`tel:${data.contact.phone.replace(/\s/g, "")}`} className="text-subtitle block text-white w-fit">
              {data.contact.phone}
            </a>
            <a href={`mailto:${data.contact.email}`} className="text-subtitle mt-[10px] block underline text-white w-fit">
              {data.contact.email}
            </a>
            <p className="text-description mt-20 whitespace-pre-line text-white/70 w-fit">{data.contact.address}</p>
          </div>

          {/* row 2 */}
          <span className="block h-2.5 3xl:h-3.75 rounded-t-[10px] border-t border-white/20 lg:col-span-3" />

          {/* row 3 */}
          <Image src={data.logo} alt="Unity Excellence" width={116} height={103} className="pointer-events-none h-auto w-[110px] 3xl:w-[116px]" />

          <nav className="flex flex-wrap gap-x-40 3xl:gap-x-50 gap-y-20">
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
          <div className="flex gap-2.5">
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
                {/* drops in from the top on hover; twice the button's height so its curved bottom edge clears the button */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 -z-10 h-[200%] -translate-y-[101%] rounded-b-[30%] bg-white transition-transform duration-400 ease-linear group-hover:translate-y-0"
                />
                {/* icons are navy; shown white until hover */}
                <Image
                  src={social.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="pointer-events-none brightness-0 invert transition-[filter] duration-300 ease-linear group-hover:brightness-100 group-hover:invert-0"
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
