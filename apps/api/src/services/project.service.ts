import { eq, and, count } from 'drizzle-orm';
import { db } from '../db/index.js';
import { projects } from '../db/schema/projects.js';
import { boards } from '../db/schema/boards.js';
import { columns } from '../db/schema/columns.js';
import { projectTags } from '../db/schema/project-tags.js';
import { projectTagAssignments } from '../db/schema/project-tag-assignments.js';
import { AppError } from '../utils/errors.js';
import { resolveProjectId } from '../utils/resolve-project.js';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const DEFAULT_COLUMNS = [
  { name: 'Backlog', position: 0, color: '#6b7280' },
  { name: 'To Do', position: 1, color: '#3b82f6' },
  { name: 'In Progress', position: 2, color: '#f59e0b', wipLimit: 3 },
  { name: 'In Review', position: 3, color: '#8b5cf6' },
  { name: 'Done', position: 4, color: '#22c55e', isDoneColumn: true },
];

export async function createProject(
  data: { name: string; description?: string; color?: string; icon?: string },
  ownerId: string,
) {
  let slug = generateSlug(data.name);

  // Ensure unique slug
  const [existing] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);

  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const [project] = await db
    .insert(projects)
    .values({ ...data, slug, ownerId })
    .returning();

  // Auto-create default board
  const [board] = await db
    .insert(boards)
    .values({ name: 'Main Board', projectId: project.id, position: 0 })
    .returning();

  // Auto-create default columns
  await db.insert(columns).values(
    DEFAULT_COLUMNS.map((col) => ({ ...col, boardId: board.id })),
  );

  return project;
}

async function attachTags<T extends { id: string }>(projectList: T[]) {
  if (projectList.length === 0) return [];

  const allAssignments = await db
    .select({
      projectId: projectTagAssignments.projectId,
      tagId: projectTags.id,
      tagName: projectTags.name,
      tagColor: projectTags.color,
    })
    .from(projectTagAssignments)
    .innerJoin(projectTags, eq(projectTagAssignments.tagId, projectTags.id));

  const tagsByProject = new Map<string, { id: string; name: string; color: string }[]>();
  for (const row of allAssignments) {
    const list = tagsByProject.get(row.projectId) ?? [];
    list.push({ id: row.tagId, name: row.tagName, color: row.tagColor });
    tagsByProject.set(row.projectId, list);
  }

  return projectList.map((p) => ({ ...p, tags: tagsByProject.get(p.id) ?? [] }));
}

export async function getProjects(ownerId: string) {
  const projectList = await db
    .select()
    .from(projects)
    .where(eq(projects.ownerId, ownerId))
    .orderBy(projects.createdAt);

  return attachTags(projectList);
}

export async function getProjectById(slugOrId: string, ownerId: string) {
  const id = await resolveProjectId(slugOrId);
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.ownerId, ownerId)))
    .limit(1);

  if (!project) {
    throw AppError.notFound('Project not found');
  }

  const [withTags] = await attachTags([project]);
  return withTags;
}

export async function updateProject(
  slugOrId: string,
  data: { name?: string; description?: string; color?: string; icon?: string },
  ownerId: string,
) {
  const id = await resolveProjectId(slugOrId);
  const [project] = await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(projects.id, id), eq(projects.ownerId, ownerId)))
    .returning();

  if (!project) {
    throw AppError.notFound('Project not found');
  }

  return project;
}

export async function deleteProject(slugOrId: string, ownerId: string) {
  const id = await resolveProjectId(slugOrId);
  const [project] = await db
    .delete(projects)
    .where(and(eq(projects.id, id), eq(projects.ownerId, ownerId)))
    .returning();

  if (!project) {
    throw AppError.notFound('Project not found');
  }

  return project;
}

export async function archiveProject(slugOrId: string, ownerId: string) {
  const id = await resolveProjectId(slugOrId);
  const [project] = await db
    .update(projects)
    .set({ status: 'archived', updatedAt: new Date() })
    .where(and(eq(projects.id, id), eq(projects.ownerId, ownerId)))
    .returning();

  if (!project) {
    throw AppError.notFound('Project not found');
  }

  return project;
}
