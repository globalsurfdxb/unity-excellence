type Props = {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

const NavButton = ({ direction, onClick, disabled = false, className = "" }: Props) => {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous" : "Next"}
      onClick={onClick}
      disabled={disabled}
      className={`group relative isolate flex size-(--btn-size) items-center justify-center overflow-hidden rounded-full border border-border-color cursor-pointer transition-[opacity,scale] duration-400 disabled:cursor-not-allowed disabled:opacity-40 ${disabled ? "" : "active:scale-95"} ${className}`}
    >
      {/* on hover one fill drops from the top and one rises from the bottom, meeting in the middle */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 -z-10 h-full translate-y-[-101%] rounded-b-[40%] bg-white transition-transform duration-200 ease-linear ${disabled ? "" : "group-hover:translate-y-[-15%]"}`}
      />
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 -z-10 h-full translate-y-[101%] rounded-t-[40%] bg-white transition-transform duration-200 ease-linear ${disabled ? "" : "group-hover:translate-y-[15%]"}`}
      />
      {/* inline so the stroke can follow the text colour */}
      <svg
        width="7"
        height="12"
        viewBox="0 0 7 12"
        fill="none"
        aria-hidden="true"
        className={`text-white transition-colors duration-200 ease-linear ${direction === "prev" ? "" : "rotate-180"} ${disabled ? "" : "group-hover:text-primary"}`}
      >
        <path d="M6 11L1 6L6 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

export default NavButton;
