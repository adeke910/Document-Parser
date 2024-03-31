import clsx from "clsx";
import { ChangeEvent } from "react";

function Input({
  type = "text",
  placeholder,
  value,
  label,
  readOnly,
  requiredLabel,
  onChange,
}: {
  type?: "text";
  placeholder?: string;
  label?: string;
  requiredLabel?: boolean;
  value?: string | number;
  readOnly?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement> | undefined) => void;
}) {
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div className="flex flex-col gap-[11px]">
      <div className="text-[15px] text-left font-normal leading-[18px]">
        {label}
        {requiredLabel ? <span className="text-red-600"> *</span> : null}
      </div>

      <input
        type={type}
        placeholder={placeholder}
        value={formattedValue}
        onChange={onChange}
        readOnly={readOnly}
        className={clsx(
          "bg-white border-pry-2 text-black border-[1px] rounded-[5px] text-[13px] text-left py-[10px] px-[15px] leading-[17.7px] font-normal focus:border-black w-full",
          readOnly ? "pointer-events-none" : ""
        )}
      ></input>
    </div>
  );
}

export default Input;
