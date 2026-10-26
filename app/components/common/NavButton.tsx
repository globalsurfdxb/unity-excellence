import Image from "next/image";

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
      className={`flex size-[50px] items-center justify-center rounded-full border border-border-color cursor-pointer transition-opacity duration-400 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      <Image
        src="/assets/icons/common/arrow-tip-left.svg"
        alt=""
        width={7}
        height={15}
        aria-hidden="true"
        className={direction === "prev" ? "" : "rotate-180"}
      />
    </button>
  );
};

export default NavButton;
