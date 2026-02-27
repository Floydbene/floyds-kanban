import { pgTable, uuid, varchar, integer, index } from 'drizzle-orm/pg-core';
import { projects } from './projects';

export const boards = pgTable('boards', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().default('Main Board'),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  position: integer('position').notNull().default(0),
}, (table) => [
  index('boards_project_id_idx').on(table.projectId),
]);
