import * as React from "react";

import { cn } from "@/lib/utils";

export function PageContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-(--page-max-width) px-(--page-padding-x)",
        className,
      )}
      {...props}
    />
  );
}
