"use client";

import { ReactNode } from "react";
import { Button, ButtonProps } from "../button";
import { cn } from "@/lib/utils";
import { LoadingSpinner, variants } from "../loading-spinner";

type LoadingButtonProps = ButtonProps & {
  isLoading?: boolean;
  children?: ReactNode;
  spinnerVariant?: keyof typeof variants;
};

export function LoadingButton({
  isLoading,
  children,
  className,
  spinnerVariant = "default",
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      className={cn("flex items-center", className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner variant={spinnerVariant} />}
      {children}
    </Button>
  );
}
