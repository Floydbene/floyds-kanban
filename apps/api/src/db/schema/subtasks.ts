import { pgTable, uuid, varchar, boolean, integer, index } from 'drizzle-orm/pg-core';
import { tasks } from './tasks.js';

export const subtasks = pgTable('subtasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 500 }).notNull(),
  isCompleted: boolean('is_completed').notNull().default(false),
  position: integer('position').notNull().default(0),
  taskId: uuid('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
}, (table) => [
  index('subtasks_task_id_idx').on(table.taskId),
]);
