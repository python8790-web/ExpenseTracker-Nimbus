import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: ReactNode;
  error?: string;
};

function Input({ label, icon, error, className = "", ...rest }: InputProps) {
  return (
    <div className="mb-4">
      {label ? (
        <label className="mb-1.5 block text-sm font-medium text-mist">
          {label}
        </label>
      ) : null}

      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mist/80 [&>svg]:h-4.5 [&>svg]:w-4.5">
            {icon}
          </span>
        ) : null}

        <input
          className={`glass-input w-full rounded-xl py-3 text-ink placeholder:text-mist/60 outline-none transition-colors duration-150 ${icon ? "pl-10 pr-4" : "px-4"} ${className}`}
          {...rest}
        />
      </div>

      {error ? <p className="mt-1.5 text-xs text-coral-400">{error}</p> : null}
    </div>
  );
}

export default Input;
