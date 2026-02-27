import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { tasks } from './tasks.js';

export const taskResources = pgTable('task_resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 500 }).notNull(),
  url: text('url').notNull(),
  resourceType: varchar('resource_type', { length: 50 }).notNull().default('link'),
  taskId: uuid('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('task_resources_task_id_idx').on(table.taskId),
]);
