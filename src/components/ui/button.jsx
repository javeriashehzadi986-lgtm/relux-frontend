import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-blue-500 text-white hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-black bg-transparent hover:bg-gray-100 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0",
        destructive:
          "bg-red-500 text-white hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        sustainabilityPrimary: "sustainability-btn sustainability-btn-primary",
        sustainabilitySecondary: "sustainability-btn sustainability-btn-secondary",
        sustainabilityOutline: "sustainability-btn sustainability-btn-outline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function Button({ children, variant = "default", className = "", ...props }) {
  return (
    <button className={cn(buttonVariants({ variant }), className)} {...props}>
      {children}
    </button>
  );
}
