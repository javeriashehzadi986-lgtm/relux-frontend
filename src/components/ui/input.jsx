import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full border-none bg-[#f3f4f3] text-[#303333] outline-none transition-all duration-300 placeholder:text-[#5d605f]/40 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#31685d]/20",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
