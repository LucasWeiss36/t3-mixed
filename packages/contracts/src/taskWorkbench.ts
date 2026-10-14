import * as Schema from "effect/Schema";
import { TrimmedNonEmptyString } from "./baseSchemas.ts";
import { ChatImageAttachment } from "./chatAttachment.ts";

export const TaskStatus = Schema.Struct({
  id: TrimmedNonEmptyString,
  name: TrimmedNonEmptyString,
  position: Schema.Int,
  completed: Schema.Boolean,
});
export type TaskStatus = typeof TaskStatus.Type;

export const BUILT_IN_TASK_STATUSES: ReadonlyArray<TaskStatus> = [
  { id: "todo", name: "Todo", position: 0, completed: false },
  { id: "in-progress", name: "In Progress", position: 1, completed: false },
  { id: "in-review", name: "In Review", position: 2, completed: false },
  { id: "blocked", name: "Blocked", position: 3, completed: false },
  { id: "done", name: "Done", position: 4, completed: true },
];

/** Task properties travel with the thread's durable V2 events and projections. */
export const ThreadTaskDetails = Schema.Struct({
  content: Schema.String.check(Schema.isMaxLength(2_000_000)),
  attachments: Schema.Array(ChatImageAttachment),
  statusId: TrimmedNonEmptyString.check(
    Schema.makeFilter(
      (id) => BUILT_IN_TASK_STATUSES.some((status) => status.id === id) || "Unknown task status",
    ),
  ),
  orderKey: Schema.String,
  assigned: Schema.optional(Schema.Boolean),
  workspaceMode: Schema.optional(Schema.Literals(["local", "worktree"])),
});
export type ThreadTaskDetails = typeof ThreadTaskDetails.Type;
