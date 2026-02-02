import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base = `
    inline-flex items-center justify-center gap-2
    font-medium uppercase tracking-wide
    border
    transition
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-sm",
  };

  const variants = {
    primary: `
      bg-white text-black
      border-white
      hover:bg-zinc-200
      focus:ring-white
    `,
    secondary: `
      bg-zinc-900 text-white
      border-zinc-700
      hover:border-zinc-500
      focus:ring-zinc-600
    `,
    ghost: `
      bg-transparent text-zinc-400
      border-transparent
      hover:text-white hover:border-zinc-700
    `,
    danger: `
      bg-red-600 text-white
      border-red-600
      hover:bg-red-500
      focus:ring-red-500
    `,
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
