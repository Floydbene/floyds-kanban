import { relations } from 'drizzle-orm';
import { users } from './schema/users.js';
import { projects } from './schema/projects.js';
import { boards } from './schema/boards.js';
import { columns } from './schema/columns.js';
import { tasks } from './schema/tasks.js';
import { labels } from './schema/labels.js';
import { taskLabels } from './schema/task-labels.js';
import { subtasks } from './schema/subtasks.js';
import { comments } from './schema/comments.js';
import { timeEntries } from './schema/time-entries.js';
import { taskResources } from './schema/task-resources.js';

export const usersRelations = relations(users, ({ one, many }) => ({
  projects: many(projects),
  comments: many(comments),
  timeEntries: many(timeEntries),
  requestedTasks: many(tasks, { relationName: 'taskRequestor' }),
  assignedTasks: many(tasks, { relationName: 'taskAssignee' }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, { fields: [projects.ownerId], references: [users.id] }),
  boards: many(boards),
  labels: many(labels),
  tasks: many(tasks),
}));

export const boardsRelations = relations(boards, ({ one, many }) => ({
  project: one(projects, { fields: [boards.projectId], references: [projects.id] }),
  columns: many(columns),
}));

export const columnsRelations = relations(columns, ({ one, many }) => ({
  board: one(boards, { fields: [columns.boardId], references: [boards.id] }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  column: one(columns, { fields: [tasks.columnId], references: [columns.id] }),
  project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
  parent: one(tasks, { fields: [tasks.parentId], references: [tasks.id], relationName: 'taskParent' }),
  children: many(tasks, { relationName: 'taskParent' }),
  taskLabels: many(taskLabels),
  subtasks: many(subtasks),
  comments: many(comments),
  timeEntries: many(timeEntries),
  taskResources: many(taskResources),
  requestor: one(users, { fields: [tasks.requestorId], references: [users.id], relationName: 'taskRequestor' }),
  assignee: one(users, { fields: [tasks.assigneeId], references: [users.id], relationName: 'taskAssignee' }),
}));

export const labelsRelations = relations(labels, ({ one, many }) => ({
  project: one(projects, { fields: [labels.projectId], references: [projects.id] }),
  taskLabels: many(taskLabels),
}));

export const taskLabelsRelations = relations(taskLabels, ({ one }) => ({
  task: one(tasks, { fields: [taskLabels.taskId], references: [tasks.id] }),
  label: one(labels, { fields: [taskLabels.labelId], references: [labels.id] }),
}));

export const subtasksRelations = relations(subtasks, ({ one }) => ({
  task: one(tasks, { fields: [subtasks.taskId], references: [tasks.id] }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  task: one(tasks, { fields: [comments.taskId], references: [tasks.id] }),
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
}));

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  task: one(tasks, { fields: [timeEntries.taskId], references: [tasks.id] }),
  user: one(users, { fields: [timeEntries.userId], references: [users.id] }),
}));

export const taskResourcesRelations = relations(taskResources, ({ one }) => ({
  task: one(tasks, { fields: [taskResources.taskId], references: [tasks.id] }),
}));
