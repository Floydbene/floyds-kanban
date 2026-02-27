import { eq, desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { comments } from '../db/schema/comments.js';
import { users } from '../db/schema/users.js';
import { AppError } from '../utils/errors.js';

export async function getCommentsByTask(taskId: string) {
  return db.query.comments.findMany({
    where: eq(comments.taskId, taskId),
    orderBy: [desc(comments.createdAt)],
    with: {
      author: {
        columns: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });
}

export async function createComment(taskId: string, authorId: string, data: { content: string }) {
  const [comment] = await db
    .insert(comments)
    .values({ ...data, taskId, authorId })
    .returning();

  // Return with author info
  const [author] = await db
    .select({ id: users.id, name: users.name, avatarUrl: users.avatarUrl })
    .from(users)
    .where(eq(users.id, authorId))
    .limit(1);

  return { ...comment, author };
}

export async function updateComment(id: string, authorId: string, data: { content: string }) {
  // Verify ownership before updating
  const [existing] = await db
    .select()
    .from(comments)
    .where(eq(comments.id, id))
    .limit(1);

  if (!existing) {
    throw AppError.notFound('Comment not found');
  }

  if (existing.authorId !== authorId) {
    throw AppError.forbidden('You can only edit your own comments');
  }

  const [comment] = await db
    .update(comments)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(comments.id, id))
    .returning();

  return comment;
}

export async function deleteComment(id: string, authorId: string) {
  // Verify ownership first
  const [existing] = await db
    .select()
    .from(comments)
    .where(eq(comments.id, id))
    .limit(1);

  if (!existing) {
    throw AppError.notFound('Comment not found');
  }

  if (existing.authorId !== authorId) {
    throw AppError.forbidden('You can only delete your own comments');
  }

  const [comment] = await db
    .delete(comments)
    .where(eq(comments.id, id))
    .returning();

  return comment;
}
