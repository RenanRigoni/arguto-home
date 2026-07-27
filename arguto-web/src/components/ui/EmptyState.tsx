import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-md border border-dashed border-border p-6 text-left">
      <p className="text-sm font-medium text-ink-700">{title}</p>
      {description ? <p className="text-sm text-ink-500">{description}</p> : null}
      {action}
    </div>
  );
}
