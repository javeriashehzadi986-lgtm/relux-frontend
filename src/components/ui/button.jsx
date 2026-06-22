import * as React from "react";
import { cn } from "@/lib/utils";
import "./button.css";

const variantClass = {
  default: "relux-btn--default",
  outline: "relux-btn--outline",
  light: "relux-btn--light",
  secondary: "relux-btn--secondary",
  google: "relux-btn--google",
  destructive: "relux-btn--destructive",
};

const sizeClass = {
  sm: "relux-btn--sm",
  default: "relux-btn--lg",
  lg: "relux-btn--lg",
  full: "relux-btn--full",
  auth: "relux-btn--auth",
};

const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "relux-btn",
      variantClass[variant] ?? variantClass.default,
      sizeClass[size] ?? sizeClass.default,
      className
    );

    if (asChild) {
      const child = React.Children.only(children);
      return React.cloneElement(child, {
        ...child.props,
        ...props,
        className: cn(classes, child.props.className),
        ref,
      });
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
