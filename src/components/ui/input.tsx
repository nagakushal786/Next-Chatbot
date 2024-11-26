import { cn } from "@/lib/utils";
import React from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-transparent",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";