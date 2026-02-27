import { pgTable, uuid, varchar, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { tasks } from './tasks.js';
import { users } from './users.js';

export const timeEntries = pgTable('time_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  description: varchar('description', { length: 500 }),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  stoppedAt: timestamp('stopped_at', { withTimezone: true }),
  durationSeconds: integer('duration_seconds'),
}, (table) => [
  index('time_entries_task_id_idx').on(table.taskId),
  index('time_entries_user_id_idx').on(table.userId),
]);
