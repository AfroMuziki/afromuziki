"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:brightness-110",
        secondary:
          "bg-white/10 text-white border border-white/15 hover:bg-white/20",
        ghost: "hover:bg-white/10 text-white/80 hover:text-white",
        outline:
          "border border-white/20 bg-transparent hover:bg-white/10 text-white",
        danger: "bg-red-500/90 text-white hover:bg-red-500",
        success: "bg-emerald-500/90 text-white hover:bg-emerald-500",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-full px-3 text-xs",
        lg: "h-12 rounded-full px-8 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
