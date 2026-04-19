import { cn } from "@/lib/utils";
import React from "react";

export function GlassCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-card/40 backdrop-blur-xl border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
