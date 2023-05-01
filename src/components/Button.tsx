import {
  type ButtonHTMLAttributes,
  type ReactNode,
  type ForwardedRef,
  forwardRef,
} from "react";
import Link from "next/link";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: ReactNode;
  href?: string;
  asLink?: boolean;
  fullWidth?: boolean;
  transparent?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      href,
      asLink = false,
      fullWidth = false,
      transparent = false,
      ...rest
    },
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const baseClass = clsx(
      "flex",
      "items-center",
      "justify-center",
      "h-12",
      "rounded-md",
      "font-bold",
      "p-3",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-offset-2"
    );

    const hasTextColor = /text-/.test(className ?? "");

    const button = (
      <button
        ref={ref}
        className={clsx(
          baseClass,
          fullWidth ? "w-full" : "",
          transparent ? "" : "bg-violet",
          !hasTextColor && "text-white",
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );

    if (asLink && href) {
      return <Link href={href}>{button}</Link>;
    }

    return button;
  }
);

Button.displayName = "Button";

export default Button;
