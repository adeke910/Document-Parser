import clsx from "clsx";
import { ReactNode } from "react";

function Button({
  handleClick,
  variant = "teal",
  children,
  customWidth,
}: {
  handleClick?: () => void;
  variant?: "teal" | "red" | "primary";
  children?: ReactNode;
  customWidth?: number;
}) {
  return (
    <>
      <button
        onClick={handleClick}
        style={{ width: customWidth ? `${customWidth}px` : "100%" }}
        className={clsx(
          "text-md h-[40px] border",
          variant === "primary"
            ? "bg-pry-2 text-white border-0 rounded-[5px] text-[13px]"
            : variant === "red"
            ? "border-red-600 text-red-600 rounded-[50px]"
            : "border-teal-600 text-teal-600 rounded-[50px]"
        )}
      >
        {children}
      </button>
    </>
  );
}

export default Button;
