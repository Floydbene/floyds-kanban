import { eq, and, asc, desc, ilike, inArray, lte, gte, sql, count } from 'drizzle-orm';
import { db } from '../db/index.js';
import { tasks } from '../db/schema/tasks.js';
import { columns } from '../db/schema/columns.js';
import { projects } from '../db/schema/projects.js';
import { taskLabels } from '../db/schema/task-labels.js';
import { labels } from '../db/schema/labels.js';
import { subtasks } from '../db/schema/subtasks.js';
import { AppError } from '../utils/errors.js';
import { resolveProjectId } from '../utils/resolve-project.js';

async function generateIdentifier(projectId: string): Promise<string> {
  const [project] = await db
    .select({ slug: projects.slug })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project) {
    throw AppError.notFound('Project not found');
  }

  const prefix = project.slug.replace(/-/g, '').slice(0, 3).toUpperCase();

  const [result] = await db
    .select({ total: count() })
    .from(tasks)
    .where(eq(tasks.projectId, projectId));

  const num = (result?.total ?? 0) + 1;
  return `${prefix}-${num}`;
}

export async function createTask(
  data: {
    title: string;
    description?: string;
    priority?: 'critical' | 'high' | 'medium' | 'low';
    type?: 'task' | 'bug' | 'spike' | 'subtask';
    columnId: string;
    dueDate?: string;
    estimatePoints?: number;
    labelIds?: string[];
    requestorId?: string;
    assigneeId?: string;
  },
  slugOrId?: string,
) {
  let projectId: string;
  if (slugOrId) {
    projectId = await resolveProjectId(slugOrId);
  } else {
    // Derive projectId from the columnId → board → project
    const [col] = await db
      .select({ boardId: columns.boardId })
      .from(columns)
      .where(eq(columns.id, data.columnId))
      .limit(1);
    if (!col) throw AppError.notFound('Column not found');
    const { boards } = await import('../db/schema/boards.js');
    const [board] = await db
      .select({ projectId: boards.projectId })
      .from(boards)
      .where(eq(boards.id, col.boardId))
      .limit(1);
    if (!board) throw AppError.notFound('Board not found');
    projectId = board.projectId;
  }
  const identifier = await generateIdentifier(projectId);

  // Get next position in column
  const existingTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.columnId, data.columnId));

  const { labelIds, ...taskData } = data;

  const [task] = await db
    .insert(tasks)
    .values({
      ...taskData,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
      identifier,
      projectId,
      position: existingTasks.length,
    })
    .returning();

  // Attach labels if provided
  if (labelIds && labelIds.length > 0) {
    await db.insert(taskLabels).values(
      labelIds.map((labelId) => ({ taskId: task.id, labelId })),
    );
  }

  return task;
}

export async function getTaskById(id: string) {
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, id),
    with: {
      taskLabels: {
        with: { label: true },
      },
      subtasks: {
        orderBy: [asc(subtasks.position)],
      },
      requestor: {
        columns: { id: true, name: true, avatarUrl: true },
      },
      assignee: {
        columns: { id: true, name: true, avatarUrl: true },
      },
    },
  });

  if (!task) {
    throw AppError.notFound('Task not found');
  }

  const { taskLabels: tl, requestor, assignee, ...rest } = task;
  return {
    ...rest,
    labels: tl.map((t) => t.label),
    requestor: requestor ?? null,
    assignee: assignee ?? null,
  };
}

export async function getTasksByProject(
  slugOrId: string,
  filters?: {
    search?: string;
    priority?: string;
    labelIds?: string[];
    dueBefore?: string;
    dueAfter?: string;
    columnId?: string;
    page?: number;
    pageSize?: number;
  },
) {
  const projectId = await resolveProjectId(slugOrId);
  const conditions = [eq(tasks.projectId, projectId)];

  if (filters?.search) {
    conditions.push(ilike(tasks.title, `%${filters.search}%`));
  }
  if (filters?.priority) {
    conditions.push(eq(tasks.priority, filters.priority as any));
  }
  if (filters?.columnId) {
    conditions.push(eq(tasks.columnId, filters.columnId));
  }
  if (filters?.dueBefore) {
    conditions.push(lte(tasks.dueDate, new Date(filters.dueBefore)));
  }
  if (filters?.dueAfter) {
    conditions.push(gte(tasks.dueDate, new Date(filters.dueAfter)));
  }

  const where = and(...conditions);
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 50;

  let query = db
    .select()
    .from(tasks)
    .where(where)
    .orderBy(asc(tasks.position))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const [totalResult] = await db
    .select({ total: count() })
    .from(tasks)
    .where(where);

  const data = await query;
  const total = totalResult?.total ?? 0;

  // Filter by labels if specified
  if (filters?.labelIds && filters.labelIds.length > 0) {
    const taskIdsWithLabels = await db
      .select({ taskId: taskLabels.taskId })
      .from(taskLabels)
      .where(inArray(taskLabels.labelId, filters.labelIds));

    const taskIdSet = new Set(taskIdsWithLabels.map((t) => t.taskId));
    const filtered = data.filter((t) => taskIdSet.has(t.id));
    return {
      data: filtered,
      meta: { total: filtered.length, page, pageSize, totalPages: Math.ceil(filtered.length / pageSize) },
    };
  }

  return {
    data,
    meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

export async function updateTask(
  id: string,
  data: {
    title?: string;
    description?: string | null;
    priority?: 'critical' | 'high' | 'medium' | 'low';
    type?: 'task' | 'bug' | 'spike' | 'subtask';
    dueDate?: string | null;
    estimatePoints?: number | null;
    isBlocked?: boolean;
    blockedReason?: string | null;
    resolution?: 'done' | 'wont_do' | 'duplicate' | 'cannot_reproduce' | 'obsolete' | null;
    assigneeId?: string | null;
    requestorId?: string | null;
  },
) {
  const updateData: any = { ...data, updatedAt: new Date() };
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }

  const [task] = await db
    .update(tasks)
    .set(updateData)
    .where(eq(tasks.id, id))
    .returning();

  if (!task) {
    throw AppError.notFound('Task not found');
  }

  return task;
}

export async function deleteTask(id: string) {
  const [task] = await db
    .delete(tasks)
    .where(eq(tasks.id, id))
    .returning();

  if (!task) {
    throw AppError.notFound('Task not found');
  }

  return task;
}

export async function moveTask(id: string, columnId: string, position: number) {
  // Get the task to find its current column
  const [task] = await db
    .select()
    .from(tasks)
    .where(eq(tasks.id, id))
    .limit(1);

  if (!task) {
    throw AppError.notFound('Task not found');
  }

  const sourceColumnId = task.columnId;

  // Check destination column type for completedAt / blocked tracking
  const [destColumn] = await db
    .select({ isDoneColumn: columns.isDoneColumn, isBlockedColumn: columns.isBlockedColumn })
    .from(columns)
    .where(eq(columns.id, columnId))
    .limit(1);

  // Use a transaction for atomic move
  await db.transaction(async (tx) => {
    // Shift positions down in source column for tasks after the moved task
    if (sourceColumnId !== columnId) {
      await tx.execute(sql`
        UPDATE tasks
        SET position = position - 1
        WHERE column_id = ${sourceColumnId}
          AND position > ${task.position}
      `);
    }

    // Shift positions up in destination column at and after the target position
    await tx.execute(sql`
      UPDATE tasks
      SET position = position + 1
      WHERE column_id = ${columnId}
        AND position >= ${position}
        AND id != ${id}
    `);

    // Update the task
    const updateData: any = { columnId, position, updatedAt: new Date() };
    if (destColumn?.isDoneColumn && !task.completedAt) {
      updateData.completedAt = new Date();
      updateData.resolution = 'done';
    } else if (!destColumn?.isDoneColumn && task.completedAt) {
      updateData.completedAt = null;
      updateData.resolution = null;
    }

    // Auto-set blocked status based on column type
    if (destColumn?.isBlockedColumn) {
      updateData.isBlocked = true;
    } else if (!destColumn?.isBlockedColumn && task.isBlocked) {
      updateData.isBlocked = false;
      updateData.blockedReason = null;
    }

    await tx.update(tasks).set(updateData).where(eq(tasks.id, id));
  });

  // Return updated task
  return getTaskById(id);
}

export async function reorderTasks(tasksOrder: { id: string; position: number }[]) {
  await Promise.all(
    tasksOrder.map(({ id, position }) =>
      db.update(tasks).set({ position }).where(eq(tasks.id, id)),
    ),
  );

  return { success: true };
}
