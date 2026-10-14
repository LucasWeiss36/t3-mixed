import type { TaskStatus } from "@t3tools/contracts";
import { CheckIcon, CircleDotIcon, CircleIcon } from "lucide-react";
import { cn } from "../../lib/utils";

const STATUS_COLORS: Record<string, string> = {
  todo: "text-muted-foreground",
  "in-progress": "text-info",
  "in-review": "text-warning",
  blocked: "text-destructive",
  done: "text-success",
};

export function TaskStatusIcon({ status, className }: { status: TaskStatus; className?: string }) {
  const color = STATUS_COLORS[status.id] ?? STATUS_COLORS.todo;
  if (status.completed) {
    return (
      <span
        aria-hidden
        className={cn(
          "grid size-4 shrink-0 place-items-center rounded-full bg-current",
          color,
          className,
        )}
      >
        <CheckIcon className="size-3 text-background" strokeWidth={3} />
      </span>
    );
  }
  const Icon = status.position === 0 ? CircleIcon : CircleDotIcon;
  return <Icon aria-hidden className={cn("size-4 shrink-0", color, className)} />;
}
