import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-xs font-bold uppercase tracking-wide text-zinc-500"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={`
          w-full
          border-2
          border-zinc-800
          bg-zinc-950
          px-4 py-2.5
          text-sm
          text-white
          placeholder-zinc-600
          focus:outline-none
          focus:border-zinc-600
          transition
          ${error ? "border-red-500" : ""}
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
