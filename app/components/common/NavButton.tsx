"use client";

import { usePressScale } from "./usePressScale";

type Props = {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

const NavButton = ({ direction, onClick, disabled = false, className = "" }: Props) => {
  const pressScale = usePressScale(!disabled);

  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous" : "Next"}
      onClick={onClick}
      disabled={disabled}
      {...pressScale}
      className={`group relative isolate flex size-[50px] items-center justify-center overflow-hidden rounded-full border border-border-color cursor-pointer transition-opacity duration-400 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {/* slides in from the left on hover; twice the button's width so its curved leading edge clears the button */}
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 -z-10 w-[200%] -translate-x-[101%] rounded-r-[30%] bg-white transition-transform duratio00 ease-linear ${disabled ? "" : "group-hover:translate-x-0"}`}
      />
      {/* inline so the stroke can follow the text colour */}
      <svg
        width="7"
        height="12"
        viewBox="0 0 7 12"
        fill="none"
        aria-hidden="true"
        className={`text-white transition-colors duration-300 ease-linear ${direction === "prev" ? "" : "rotate-180"} ${disabled ? "" : "group-hover:text-primary"}`}
      >
        <path d="M6 11L1 6L6 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

export default NavButton;
