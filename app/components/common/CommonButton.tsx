"use client";

import Link from "next/link";
import { usePressScale } from "./usePressScale";

type Props = {
  label: string;
  href: string;
  variant?: "light" | "dark";
  disabled?: boolean;
  className?: string;
};

const CommonButton = ({ label, href, variant = "light", disabled = false, className = "" }: Props) => {
  const light = variant === "light";
  const pressScale = usePressScale(!disabled);
  const classes = `group relative isolate overflow-hidden w-fit flex justify-center items-center rounded-full border border-border-color h-(--btn-size) px-(--btn-px) transition-opacity duration-300 ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"} ${className}`;
  const text = (
    <span className={`relative text-description-2 text-trim transition-colors duration-200 ease-linear ${light ? "text-white" : "text-primary"} ${disabled ? "" : light ? "group-hover:text-primary" : "group-hover:text-white"}`}>
      {label}
    </span>
  );

  // a disabled link renders as plain text so it can't be clicked
  if (disabled) {
    return (
      <span aria-disabled="true" className={classes}>
        {text}
      </span>
    );
  }

  return (
    <Link href={href} className={classes} {...pressScale}>
      {/* on hover one fill drops from the top and one rises from the bottom; each stops past the middle
          so their curved edges overlap and the button ends fully covered */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 -z-10 h-full translate-y-[-101%] rounded-b-[40%] transition-transform duration-200 ease-linear group-hover:translate-y-[-15%] ${light ? "bg-white" : "bg-primary"}`}
      />
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 -z-10 h-full translate-y-[101%] rounded-t-[40%] transition-transform duration-200 ease-linear group-hover:translate-y-[15%] ${light ? "bg-white" : "bg-primary"}`}
      />
      {text}
    </Link>
  );
};

export default CommonButton;
