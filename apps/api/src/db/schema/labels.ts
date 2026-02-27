import { pgTable, uuid, varchar, index } from 'drizzle-orm/pg-core';
import { projects } from './projects';

export const labels = pgTable('labels', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  color: varchar('color', { length: 7 }).notNull(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
}, (table) => [
  index('labels_project_id_idx').on(table.projectId),
]);
