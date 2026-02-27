import { pgTable, uuid, varchar, text, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { taskPriorityEnum, taskTypeEnum, taskResolutionEnum } from './enums.js';
import { columns } from './columns.js';
import { projects } from './projects.js';
import { users } from './users.js';

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  identifier: varchar('identifier', { length: 20 }).notNull(),
  priority: taskPriorityEnum('priority').notNull().default('medium'),
  type: taskTypeEnum('type').notNull().default('task'),
  columnId: uuid('column_id').notNull().references(() => columns.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  parentId: uuid('parent_id').references((): any => tasks.id, { onDelete: 'cascade' }),
  position: integer('position').notNull().default(0),
  dueDate: timestamp('due_date', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  resolution: taskResolutionEnum('resolution'),
  estimatePoints: integer('estimate_points'),
  isBlocked: boolean('is_blocked').notNull().default(false),
  blockedReason: text('blocked_reason'),
  requestorId: uuid('requestor_id').references(() => users.id, { onDelete: 'set null' }),
  assigneeId: uuid('assignee_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('tasks_column_id_idx').on(table.columnId),
  index('tasks_project_id_idx').on(table.projectId),
  index('tasks_priority_idx').on(table.priority),
  index('tasks_due_date_idx').on(table.dueDate),
  index('tasks_identifier_idx').on(table.identifier),
  index('tasks_type_idx').on(table.type),
  index('tasks_parent_id_idx').on(table.parentId),
  index('tasks_requestor_id_idx').on(table.requestorId),
  index('tasks_assignee_id_idx').on(table.assigneeId),
]);
