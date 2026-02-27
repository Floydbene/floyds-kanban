import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  icon: z.string().max(50).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const createColumnSchema = z.object({
  name: z.string().min(1).max(255),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  wipLimit: z.number().int().positive().optional(),
  isDoneColumn: z.boolean().optional(),
});

export const updateColumnSchema = createColumnSchema.partial().extend({
  isCollapsed: z.boolean().optional(),
  isBlockedColumn: z.boolean().optional(),
});

export const reorderColumnsSchema = z.object({
  columns: z.array(z.object({
    id: z.string().uuid(),
    position: z.number().int().min(0),
  })),
});

export const createTaskSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  priority: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  type: z.enum(['task', 'bug', 'spike', 'subtask']).optional(),
  columnId: z.string().uuid(),
  dueDate: z.string().datetime().optional(),
  estimatePoints: z.number().int().positive().optional(),
  labelIds: z.array(z.string().uuid()).optional(),
  assigneeId: z.string().uuid().nullable().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().nullable().optional(),
  priority: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  type: z.enum(['task', 'bug', 'spike', 'subtask']).optional(),
  dueDate: z.string().datetime().nullable().optional(),
  estimatePoints: z.number().int().positive().nullable().optional(),
  isBlocked: z.boolean().optional(),
  blockedReason: z.string().max(500).nullable().optional(),
  resolution: z.enum(['done', 'wont_do', 'duplicate', 'cannot_reproduce', 'obsolete']).nullable().optional(),
  assigneeId: z.string().uuid().nullable().optional(),
  requestorId: z.string().uuid().nullable().optional(),
});

export const moveTaskSchema = z.object({
  columnId: z.string().uuid(),
  position: z.number().int().min(0),
});

export const reorderTasksSchema = z.object({
  tasks: z.array(z.object({
    id: z.string().uuid(),
    position: z.number().int().min(0),
  })),
});

export const createLabelSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const createProjectTagSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const updateLabelSchema = createLabelSchema.partial();

export const createSubtaskSchema = z.object({
  title: z.string().min(1).max(500),
});

export const updateSubtaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  isCompleted: z.boolean().optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1),
});

export const updateCommentSchema = createCommentSchema;

export const createResourceSchema = z.object({
  title: z.string().min(1).max(500),
  url: z.string().url(),
  resourceType: z.enum(['link', 'github', 'docs']).optional(),
});

export const updateResourceSchema = createResourceSchema.partial();

export const createTimeEntrySchema = z.object({
  taskId: z.string().uuid(),
  description: z.string().max(500).optional(),
});

export const manualTimeEntrySchema = z.object({
  taskId: z.string().uuid(),
  description: z.string().max(500).optional(),
  startedAt: z.string().datetime(),
  stoppedAt: z.string().datetime(),
});
