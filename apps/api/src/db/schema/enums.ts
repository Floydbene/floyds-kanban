import { pgEnum } from 'drizzle-orm/pg-core';

export const projectStatusEnum = pgEnum('project_status', ['active', 'archived']);

export const taskPriorityEnum = pgEnum('task_priority', ['critical', 'high', 'medium', 'low']);

export const taskTypeEnum = pgEnum('task_type', ['task', 'bug', 'spike', 'subtask']);

export const taskResolutionEnum = pgEnum('task_resolution', ['done', 'wont_do', 'duplicate', 'cannot_reproduce', 'obsolete']);
