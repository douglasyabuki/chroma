import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type MaterialButtonProps = ComponentProps<"button"> & {
  variant?: "filled" | "tonal" | "outlined" | "text" | "elevated";
  leadingIcon?: ReactNode;
};

export function MaterialButton({
  variant = "filled",
  leadingIcon,
  children,
  className,
  type = "button",
  ...props
}: MaterialButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={cn(
        "group/button inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 align-middle text-sm leading-5 font-medium focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--md-sys-color-primary) disabled:cursor-default",
        className,
      )}
      data-variant={variant}
    >
      <span
        data-material-button-surface=""
        className={cn(
          "relative isolate inline-flex min-h-10 items-center justify-center gap-2 rounded-[inherit] border border-transparent px-5.75 py-2.25 transition-shadow duration-150 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:bg-current before:opacity-0 before:transition-opacity before:duration-150 before:content-[''] group-enabled/button:group-hover/button:before:opacity-8 group-enabled/button:group-active/button:before:opacity-12 has-[[data-material-ripple]]:before:hidden forced-colors:border-[ButtonText]",
          "group-enabled/button:group-data-[variant=filled]/button:bg-(--md-sys-color-primary) group-enabled/button:group-data-[variant=filled]/button:text-(--md-sys-color-on-primary) group-enabled/button:group-data-[variant=tonal]/button:bg-(--md-sys-color-secondary-container) group-enabled/button:group-data-[variant=tonal]/button:text-(--md-sys-color-on-secondary-container)",
          "group-data-[variant=outlined]/button:border-(--md-sys-color-outline) group-enabled/button:group-data-[variant=outlined]/button:text-(--md-sys-color-primary) group-data-[variant=text]/button:px-3 group-enabled/button:group-data-[variant=text]/button:text-(--md-sys-color-primary)",
          "group-enabled/button:group-data-[variant=elevated]/button:bg-(--md-sys-color-surface-container-low) group-enabled/button:group-data-[variant=elevated]/button:text-(--md-sys-color-primary) group-data-[variant=elevated]/button:group-enabled/button:shadow-[0_1px_2px_color-mix(in_srgb,var(--md-sys-color-shadow)_30%,transparent),0_1px_3px_1px_color-mix(in_srgb,var(--md-sys-color-shadow)_15%,transparent)]",
          "group-disabled/button:bg-(--md-sys-color-on-surface)/12 group-disabled/button:text-(--md-sys-color-on-surface)/38 group-disabled/button:group-data-[variant=outlined]/button:border-(--md-sys-color-on-surface)/12 group-disabled/button:group-data-[variant=outlined]/button:bg-transparent group-disabled/button:group-data-[variant=text]/button:bg-transparent",
          leadingIcon && "ps-4",
        )}
      >
        {leadingIcon && (
          <span className="inline-flex [&>svg]:size-4.5" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        {children}
      </span>
    </button>
  );
}
