import { eq, and, gte, lte, inArray, isNotNull, sql, count } from 'drizzle-orm';
import { db } from '../db/index.js';
import { projects } from '../db/schema/projects.js';
import { tasks } from '../db/schema/tasks.js';
import { columns } from '../db/schema/columns.js';
import { boards } from '../db/schema/boards.js';
import { labels } from '../db/schema/labels.js';
import { taskLabels } from '../db/schema/task-labels.js';

async function getProjectIds(projectId: string | undefined, ownerId: string): Promise<string[]> {
  if (projectId) return [projectId];

  const owned = await db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.ownerId, ownerId));

  return owned.map((p) => p.id);
}

function projectFilter(projectIds: string[]) {
  return projectIds.length === 1
    ? eq(tasks.projectId, projectIds[0])
    : inArray(tasks.projectId, projectIds);
}

export async function getSummary(projectId: string | undefined, ownerId: string) {
  const projectIds = await getProjectIds(projectId, ownerId);
  if (projectIds.length === 0) {
    return { totalTasks: 0, completedThisWeek: 0, inProgress: 0, overdue: 0 };
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const pFilter = projectFilter(projectIds);

  const [totalResult] = await db
    .select({ total: count() })
    .from(tasks)
    .where(pFilter);

  const [completedThisWeekResult] = await db
    .select({ total: count() })
    .from(tasks)
    .where(
      and(
        pFilter,
        isNotNull(tasks.completedAt),
        gte(tasks.completedAt, weekAgo),
      ),
    );

  const doneColumnIds = await db
    .select({ id: columns.id })
    .from(columns)
    .innerJoin(boards, eq(columns.boardId, boards.id))
    .where(
      and(
        projectIds.length === 1
          ? eq(boards.projectId, projectIds[0])
          : inArray(boards.projectId, projectIds),
        eq(columns.isDoneColumn, true),
      ),
    );

  const doneIds = new Set(doneColumnIds.map((c) => c.id));

  const allProjectTasks = await db
    .select({ columnId: tasks.columnId })
    .from(tasks)
    .where(pFilter);

  const inProgress = allProjectTasks.filter((t) => !doneIds.has(t.columnId)).length;

  const [overdueResult] = await db
    .select({ total: count() })
    .from(tasks)
    .where(
      and(
        pFilter,
        isNotNull(tasks.dueDate),
        lte(tasks.dueDate, now),
        sql`${tasks.completedAt} IS NULL`,
      ),
    );

  return {
    totalTasks: totalResult?.total ?? 0,
    completedThisWeek: completedThisWeekResult?.total ?? 0,
    inProgress,
    overdue: overdueResult?.total ?? 0,
  };
}

export async function getThroughput(projectId: string | undefined, ownerId: string) {
  const projectIds = await getProjectIds(projectId, ownerId);
  if (projectIds.length === 0) return [];

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const results = await db
    .select({
      date: sql<string>`DATE(${tasks.completedAt})`.as('date'),
      completed: count(),
    })
    .from(tasks)
    .where(
      and(
        projectFilter(projectIds),
        isNotNull(tasks.completedAt),
        gte(tasks.completedAt, thirtyDaysAgo),
      ),
    )
    .groupBy(sql`DATE(${tasks.completedAt})`)
    .orderBy(sql`DATE(${tasks.completedAt})`);

  return results.map((r) => ({
    date: r.date,
    completed: r.completed,
  }));
}

export async function getCycleTime(projectId: string | undefined, ownerId: string) {
  const projectIds = await getProjectIds(projectId, ownerId);
  if (projectIds.length === 0) return [];

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const results = await db
    .select({
      date: sql<string>`DATE(${tasks.completedAt})`.as('date'),
      avgDays: sql<number>`AVG(EXTRACT(EPOCH FROM (${tasks.completedAt} - ${tasks.createdAt})) / 86400)`.as('avg_days'),
    })
    .from(tasks)
    .where(
      and(
        projectFilter(projectIds),
        isNotNull(tasks.completedAt),
        gte(tasks.completedAt, thirtyDaysAgo),
      ),
    )
    .groupBy(sql`DATE(${tasks.completedAt})`)
    .orderBy(sql`DATE(${tasks.completedAt})`);

  return results.map((r) => ({
    date: r.date,
    avgDays: Math.round((r.avgDays ?? 0) * 100) / 100,
  }));
}

export async function getPriorityDistribution(projectId: string | undefined, ownerId: string) {
  const projectIds = await getProjectIds(projectId, ownerId);
  if (projectIds.length === 0) return [];

  const results = await db
    .select({
      priority: tasks.priority,
      total: count(),
    })
    .from(tasks)
    .where(projectFilter(projectIds))
    .groupBy(tasks.priority);

  const colorMap: Record<string, string> = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#22c55e',
  };

  return results.map((r) => ({
    name: r.priority,
    value: r.total,
    color: colorMap[r.priority] ?? '#6b7280',
  }));
}

export async function getLabelDistribution(projectId: string | undefined, ownerId: string) {
  const projectIds = await getProjectIds(projectId, ownerId);
  if (projectIds.length === 0) return [];

  const results = await db
    .select({
      name: labels.name,
      color: labels.color,
      total: count(),
    })
    .from(taskLabels)
    .innerJoin(labels, eq(taskLabels.labelId, labels.id))
    .innerJoin(tasks, eq(taskLabels.taskId, tasks.id))
    .where(projectFilter(projectIds))
    .groupBy(labels.id, labels.name, labels.color);

  return results.map((r) => ({
    name: r.name,
    value: r.total,
    color: r.color,
  }));
}
