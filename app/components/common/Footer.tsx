"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { footerData } from "./data";
import CommonButton from "./CommonButton";

type Props = {
  data: typeof footerData;
};

const Footer = ({ data }: Props) => {
  const pathname = usePathname();

  return (
    <footer className="relative overflow-hidden rounded-t-[40px] pt-130 pb-60 min-[1900px]:pb-[66px]">
      <Image src={data.background} alt="" fill className="object-cover pointer-events-none" />

      <div className="container relative">
        <div className="grid gap-x-40 gap-y-40 lg:grid-cols-[1.2fr_1fr_auto] lg:items-center">
          {/* row 1 */}
          <div className="lg:self-start">
            <h2 className="section-title text-white">{data.title}</h2>
            <p className="text-description mt-20 max-w-[40ch] text-white/70">{data.description}</p>
            <CommonButton label={data.button.label} href={data.button.href} className="mt-40" />
          </div>
          <div className="lg:col-span-2 lg:self-start mt-3">
            <a href={`tel:${data.contact.phone.replace(/\s/g, "")}`} className="text-subtitle block text-white">
              {data.contact.phone}
            </a>
            <a href={`mailto:${data.contact.email}`} className="text-subtitle mt-[10px] block underline text-white">
              {data.contact.email}
            </a>
            <p className="text-description mt-20 whitespace-pre-line text-white/70">{data.contact.address}</p>
          </div>

          {/* row 2 */}
          <span className="block h-2.5 3xl:h-3.75 rounded-t-[10px] border-t border-white/20 lg:col-span-3" />

          {/* row 3 */}
          <Image src={data.logo} alt="Unity Excellence" width={117} height={104} className="h-auto w-[90px] lg:w-[117px]" />

          <nav className="flex flex-wrap gap-x-50 gap-y-20">
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
                className="group flex size-[48px] items-center justify-center rounded-full border border-border-color/20 transition-colors duration-500 hover:bg-white"
              >
                {/* icons are navy; shown white until hover */}
                <Image
                  src={social.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="brightness-0 invert transition-[filter] duration-500 group-hover:brightness-100 group-hover:invert-0"
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
