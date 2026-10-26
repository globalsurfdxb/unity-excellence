import Link from "next/link";

type Props = {
  label: string;
  href: string;
  variant?: "light" | "dark";
  disabled?: boolean;
  className?: string;
};

const CommonButton = ({ label, href, variant = "light", disabled = false, className = "" }: Props) => {
  const classes = `w-fit flex justify-center items-center rounded-full border border-border-color px-5 py-5 max-h-12.5 transition-opacity duration-300 ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"} ${className}`;
  const text = (
    <span className={`text-description-2 text-trim transition-colors duration-500 ${variant === "light" ? "text-white" : "text-primary"}`}>
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
    <Link href={href} className={classes}>
      {text}
    </Link>
  );
};

export default CommonButton;
