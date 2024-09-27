import { cn } from "@/lib/utils";
import React from "react";

type TProps = {
  children: React.ReactNode;
  className?: string;
} & Record<string, any>;

function Container({ children, className, ...props }: TProps) {
  return (
    <div
      {...props}
      className={cn('max-w-7xl mx-auto', className)}
    >
      {children}
    </div>
  );
}

export default Container;
