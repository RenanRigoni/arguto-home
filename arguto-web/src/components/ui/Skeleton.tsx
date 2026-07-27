import { cn } from "@/lib/cn";

type Props = {
  className?: string;
};

export function Skeleton({ className }: Props) {
  return <div className={cn("animate-pulse rounded-md bg-surface-100", className)} aria-hidden="true" />;
}
