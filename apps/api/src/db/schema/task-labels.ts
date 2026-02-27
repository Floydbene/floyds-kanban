import { pgTable, uuid, primaryKey, index } from 'drizzle-orm/pg-core';
import { tasks } from './tasks';
import { labels } from './labels';

export const taskLabels = pgTable('task_labels', {
  taskId: uuid('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  labelId: uuid('label_id').notNull().references(() => labels.id, { onDelete: 'cascade' }),
}, (table) => [
  primaryKey({ columns: [table.taskId, table.labelId] }),
  index('task_labels_task_id_idx').on(table.taskId),
  index('task_labels_label_id_idx').on(table.labelId),
]);
