import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  children?: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
  loading?: boolean;
};

const VARIANT_CLASSES: Record<string, string> = {
  primary:
    "bg-gradient-to-b from-mint-400 to-mint-500 text-nimbus-950 shadow-[0_10px_30px_-10px_rgba(22,199,151,0.6)] hover:brightness-110",
  secondary:
    "glass glass-pill text-ink hover:bg-white/10",
  ghost:
    "bg-transparent text-mist hover:text-ink hover:bg-white/5",
  danger:
    "bg-gradient-to-b from-coral-400 to-red-500 text-white shadow-[0_10px_30px_-10px_rgba(255,90,90,0.55)] hover:brightness-110",
};

function Button({
  text,
  children,
  variant = "primary",
  fullWidth,
  loading,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={rest.type ?? "button"}
      disabled={disabled || loading}
      className={`glossy relative flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold tracking-tight transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASSES[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      <span className="relative z-10">{children ?? text}</span>
    </button>
  );
}

export default Button;
