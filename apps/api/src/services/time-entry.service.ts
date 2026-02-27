import { eq, and, isNull, desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { timeEntries } from '../db/schema/time-entries.js';
import { AppError } from '../utils/errors.js';

export async function startTimer(userId: string, data: { taskId: string; description?: string }) {
  // Check for already running timer
  const [active] = await db
    .select()
    .from(timeEntries)
    .where(and(eq(timeEntries.userId, userId), isNull(timeEntries.stoppedAt)))
    .limit(1);

  if (active) {
    throw AppError.conflict('You already have a running timer. Stop it first.', 'TIMER_ACTIVE');
  }

  const [entry] = await db
    .insert(timeEntries)
    .values({
      taskId: data.taskId,
      userId,
      description: data.description,
      startedAt: new Date(),
    })
    .returning();

  return entry;
}

export async function stopTimer(userId: string) {
  const [active] = await db
    .select()
    .from(timeEntries)
    .where(and(eq(timeEntries.userId, userId), isNull(timeEntries.stoppedAt)))
    .limit(1);

  if (!active) {
    throw AppError.notFound('No active timer found');
  }

  const stoppedAt = new Date();
  const durationSeconds = Math.floor((stoppedAt.getTime() - active.startedAt.getTime()) / 1000);

  const [entry] = await db
    .update(timeEntries)
    .set({ stoppedAt, durationSeconds })
    .where(eq(timeEntries.id, active.id))
    .returning();

  return entry;
}

export async function getActiveTimer(userId: string) {
  const [active] = await db
    .select()
    .from(timeEntries)
    .where(and(eq(timeEntries.userId, userId), isNull(timeEntries.stoppedAt)))
    .limit(1);

  return active || null;
}

export async function createManualEntry(
  userId: string,
  data: { taskId: string; description?: string; startedAt: string; stoppedAt: string },
) {
  const start = new Date(data.startedAt);
  const stop = new Date(data.stoppedAt);
  const durationSeconds = Math.floor((stop.getTime() - start.getTime()) / 1000);

  if (durationSeconds <= 0) {
    throw AppError.badRequest('stoppedAt must be after startedAt');
  }

  const [entry] = await db
    .insert(timeEntries)
    .values({
      taskId: data.taskId,
      userId,
      description: data.description,
      startedAt: start,
      stoppedAt: stop,
      durationSeconds,
    })
    .returning();

  return entry;
}

export async function getEntriesByTask(taskId: string) {
  return db
    .select()
    .from(timeEntries)
    .where(eq(timeEntries.taskId, taskId))
    .orderBy(desc(timeEntries.startedAt));
}
