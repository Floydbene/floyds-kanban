import { eq, asc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { boards } from '../db/schema/boards.js';
import { columns } from '../db/schema/columns.js';
import { tasks } from '../db/schema/tasks.js';
import { labels } from '../db/schema/labels.js';
import { taskLabels } from '../db/schema/task-labels.js';
import { subtasks } from '../db/schema/subtasks.js';
import { AppError } from '../utils/errors.js';
import { resolveProjectId } from '../utils/resolve-project.js';

export async function getBoardWithColumns(boardId: string) {
  const board = await db.query.boards.findFirst({
    where: eq(boards.id, boardId),
    with: {
      columns: {
        orderBy: [asc(columns.position)],
        with: {
          tasks: {
            orderBy: [asc(tasks.position)],
            with: {
              taskLabels: {
                with: {
                  label: true,
                },
              },
              subtasks: {
                orderBy: [asc(subtasks.position)],
              },
              requestor: { columns: { id: true, name: true, avatarUrl: true } },
              assignee: { columns: { id: true, name: true, avatarUrl: true } },
            },
          },
        },
      },
    },
  });

  if (!board) {
    throw AppError.notFound('Board not found');
  }

  // Transform taskLabels join to flat labels array
  const transformed = {
    ...board,
    columns: board.columns.map((col) => ({
      ...col,
      tasks: col.tasks.map((task) => {
        const { taskLabels: tl, requestor, assignee, ...taskRest } = task;
        return {
          ...taskRest,
          labels: tl.map((tl) => tl.label),
          requestor: requestor ?? null,
          assignee: assignee ?? null,
        };
      }),
    })),
  };

  return transformed;
}

export async function getBoardsByProject(slugOrId: string) {
  const projectId = await resolveProjectId(slugOrId);
  return db
    .select()
    .from(boards)
    .where(eq(boards.projectId, projectId))
    .orderBy(asc(boards.position));
}

export async function getDefaultBoardWithColumns(slugOrId: string) {
  const projectId = await resolveProjectId(slugOrId);
  const [firstBoard] = await db
    .select()
    .from(boards)
    .where(eq(boards.projectId, projectId))
    .orderBy(asc(boards.position))
    .limit(1);

  if (!firstBoard) {
    throw AppError.notFound('No board found for this project');
  }

  return getBoardWithColumns(firstBoard.id);
}

export async function createBoard(data: { name: string; projectId: string }) {
  const projectId = await resolveProjectId(data.projectId);
  // Get next position
  const existing = await db
    .select()
    .from(boards)
    .where(eq(boards.projectId, projectId));

  const [board] = await db
    .insert(boards)
    .values({ ...data, projectId, position: existing.length })
    .returning();

  return board;
}

export async function updateBoard(id: string, data: { name?: string }) {
  const [board] = await db
    .update(boards)
    .set(data)
    .where(eq(boards.id, id))
    .returning();

  if (!board) {
    throw AppError.notFound('Board not found');
  }

  return board;
}

export async function deleteBoard(id: string) {
  const [board] = await db
    .delete(boards)
    .where(eq(boards.id, id))
    .returning();

  if (!board) {
    throw AppError.notFound('Board not found');
  }

  return board;
}
