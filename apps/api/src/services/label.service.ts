import { eq, and } from 'drizzle-orm';
import { db } from '../db/index.js';
import { labels } from '../db/schema/labels.js';
import { taskLabels } from '../db/schema/task-labels.js';
import { AppError } from '../utils/errors.js';
import { resolveProjectId } from '../utils/resolve-project.js';

export async function getLabelsByProject(slugOrId: string) {
  const projectId = await resolveProjectId(slugOrId);
  return db
    .select()
    .from(labels)
    .where(eq(labels.projectId, projectId));
}

export async function createLabel(slugOrId: string, data: { name: string; color: string }) {
  const projectId = await resolveProjectId(slugOrId);
  const [label] = await db
    .insert(labels)
    .values({ ...data, projectId })
    .returning();

  return label;
}

export async function updateLabel(id: string, data: { name?: string; color?: string }) {
  const [label] = await db
    .update(labels)
    .set(data)
    .where(eq(labels.id, id))
    .returning();

  if (!label) {
    throw AppError.notFound('Label not found');
  }

  return label;
}

export async function deleteLabel(id: string) {
  const [label] = await db
    .delete(labels)
    .where(eq(labels.id, id))
    .returning();

  if (!label) {
    throw AppError.notFound('Label not found');
  }

  return label;
}

export async function addLabelToTask(taskId: string, labelId: string) {
  const [existing] = await db
    .select()
    .from(taskLabels)
    .where(and(eq(taskLabels.taskId, taskId), eq(taskLabels.labelId, labelId)))
    .limit(1);

  if (existing) {
    return existing;
  }

  const [result] = await db
    .insert(taskLabels)
    .values({ taskId, labelId })
    .returning();

  return result;
}

export async function removeLabelFromTask(taskId: string, labelId: string) {
  const [result] = await db
    .delete(taskLabels)
    .where(and(eq(taskLabels.taskId, taskId), eq(taskLabels.labelId, labelId)))
    .returning();

  if (!result) {
    throw AppError.notFound('Label not attached to this task');
  }

  return result;
}
