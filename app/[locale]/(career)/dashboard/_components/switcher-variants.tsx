import { cva } from "class-variance-authority";

export const dashboardSwitcherItemVariants = cva("relative transition-colors", {
  variants: {
    active: {
      true: "text-foreground after:absolute after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary",
      false: "text-muted-foreground hover:text-foreground",
    },
    underlineInset: {
      sm: "after:right-1 after:left-1",
      md: "after:right-2 after:left-2",
      lg: "after:right-3 after:left-3",
    },
  },
  defaultVariants: {
    active: false,
    underlineInset: "md",
  },
});