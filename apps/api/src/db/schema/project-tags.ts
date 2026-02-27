import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const projectTags = pgTable('project_tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  color: varchar('color', { length: 7 }).notNull(),
});
