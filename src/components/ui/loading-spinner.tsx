import { cn } from "@/lib/utils";
import { Icons } from "../icons";

const sizes = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
};

export const variants = {
  default: "text-white",
  gray: "text-gray-600",
  primary: "text-blue-600",
};

type LoadingSpinnerProps = {
  className?: string;
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
};

export function LoadingSpinner({
  size = "sm",
  variant = "default",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <Icons.spinner
      className={cn("animate-spin", sizes[size], variants[variant], className)}
    />
  );
}
