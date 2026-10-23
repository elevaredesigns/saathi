"use client";

import { Field } from "./Field";

/** Back-compat wrapper — plain text input on the 2.0 Field. */
export function TextField({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  className,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  className?: string;
}) {
  return (
    <Field label={label ?? ""} value={value} onChange={onChange} placeholder={placeholder} inputMode={inputMode} className={className} />
  );
}
