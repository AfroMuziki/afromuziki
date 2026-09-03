import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "gradient" | "player";
}

export function Card({
  className,
  variant = "default",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl transition-premium",
        variant === "default" && "bg-white/5 border border-white/10",
        variant === "glass" && "glass",
        variant === "gradient" && "gradient-card border border-white/10",
        variant === "player" && "gradient-player border border-white/15 shadow-2xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
