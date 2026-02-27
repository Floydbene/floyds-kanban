import { pgTable, uuid, primaryKey, index } from 'drizzle-orm/pg-core';
import { projects } from './projects.js';
import { projectTags } from './project-tags.js';

export const projectTagAssignments = pgTable('project_tag_assignments', {
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => projectTags.id, { onDelete: 'cascade' }),
}, (table) => [
  primaryKey({ columns: [table.projectId, table.tagId] }),
  index('project_tag_assignments_project_id_idx').on(table.projectId),
  index('project_tag_assignments_tag_id_idx').on(table.tagId),
]);
