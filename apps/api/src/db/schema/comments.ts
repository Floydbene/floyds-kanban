import { pgTable, uuid, text, timestamp, index } from 'drizzle-orm/pg-core';
import { tasks } from './tasks.js';
import { users } from './users.js';

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  taskId: uuid('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('comments_task_id_idx').on(table.taskId),
  index('comments_author_id_idx').on(table.authorId),
]);
