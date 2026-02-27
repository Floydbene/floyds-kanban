import { eq, asc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { subtasks } from '../db/schema/subtasks.js';
import { AppError } from '../utils/errors.js';

export async function getSubtasksByTask(taskId: string) {
  return db
    .select()
    .from(subtasks)
    .where(eq(subtasks.taskId, taskId))
    .orderBy(asc(subtasks.position));
}

export async function createSubtask(taskId: string, data: { title: string }) {
  const existing = await db
    .select()
    .from(subtasks)
    .where(eq(subtasks.taskId, taskId));

  const [subtask] = await db
    .insert(subtasks)
    .values({ ...data, taskId, position: existing.length })
    .returning();

  return subtask;
}

export async function updateSubtask(id: string, data: { title?: string; isCompleted?: boolean }) {
  const [subtask] = await db
    .update(subtasks)
    .set(data)
    .where(eq(subtasks.id, id))
    .returning();

  if (!subtask) {
    throw AppError.notFound('Subtask not found');
  }

  return subtask;
}

export async function deleteSubtask(id: string) {
  const [subtask] = await db
    .delete(subtasks)
    .where(eq(subtasks.id, id))
    .returning();

  if (!subtask) {
    throw AppError.notFound('Subtask not found');
  }

  return subtask;
}

export async function reorderSubtasks(items: { id: string; position: number }[]) {
  await Promise.all(
    items.map(({ id, position }) =>
      db.update(subtasks).set({ position }).where(eq(subtasks.id, id)),
    ),
  );

  return { success: true };
}
