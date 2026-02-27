import { eq, asc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { columns } from '../db/schema/columns.js';
import { AppError } from '../utils/errors.js';

export async function getColumnsByBoard(boardId: string) {
  return db
    .select()
    .from(columns)
    .where(eq(columns.boardId, boardId))
    .orderBy(asc(columns.position));
}

export async function createColumn(
  boardId: string,
  data: { name: string; color?: string; wipLimit?: number; isDoneColumn?: boolean },
) {
  const existing = await db
    .select()
    .from(columns)
    .where(eq(columns.boardId, boardId));

  const [column] = await db
    .insert(columns)
    .values({ ...data, boardId, position: existing.length })
    .returning();

  return column;
}

export async function updateColumn(
  id: string,
  data: { name?: string; color?: string; wipLimit?: number; isDoneColumn?: boolean; isBlockedColumn?: boolean; isCollapsed?: boolean },
) {
  const [column] = await db
    .update(columns)
    .set(data)
    .where(eq(columns.id, id))
    .returning();

  if (!column) {
    throw AppError.notFound('Column not found');
  }

  return column;
}

export async function deleteColumn(id: string) {
  const [column] = await db
    .delete(columns)
    .where(eq(columns.id, id))
    .returning();

  if (!column) {
    throw AppError.notFound('Column not found');
  }

  return column;
}

export async function reorderColumns(columnsOrder: { id: string; position: number }[]) {
  const results = await Promise.all(
    columnsOrder.map(({ id, position }) =>
      db.update(columns).set({ position }).where(eq(columns.id, id)).returning(),
    ),
  );

  return results.flat();
}
