import type { HTMLAttributes, ReactNode } from "react";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  as?: "panel" | "card";
};

function GlassCard({ children, as = "card", className = "", ...rest }: GlassCardProps) {
  const radius = as === "panel" ? "glass-panel" : "glass-card";
  return (
    <div className={`glass ${radius} ${className}`} {...rest}>
      {children}
    </div>
  );
}

export default GlassCard;
