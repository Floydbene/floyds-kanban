import { eq, and } from 'drizzle-orm';
import { db } from '../db/index.js';
import { projectTags } from '../db/schema/project-tags.js';
import { projectTagAssignments } from '../db/schema/project-tag-assignments.js';
import { AppError } from '../utils/errors.js';
import { resolveProjectId } from '../utils/resolve-project.js';

export async function getAllTags() {
  return db.select().from(projectTags);
}

export async function createTag(data: { name: string; color: string }) {
  const [tag] = await db
    .insert(projectTags)
    .values(data)
    .returning();

  return tag;
}

export async function deleteTag(id: string) {
  const [tag] = await db
    .delete(projectTags)
    .where(eq(projectTags.id, id))
    .returning();

  if (!tag) {
    throw AppError.notFound('Tag not found');
  }

  return tag;
}

export async function assignTagToProject(slugOrId: string, tagId: string) {
  const projectId = await resolveProjectId(slugOrId);

  const [existing] = await db
    .select()
    .from(projectTagAssignments)
    .where(and(
      eq(projectTagAssignments.projectId, projectId),
      eq(projectTagAssignments.tagId, tagId),
    ))
    .limit(1);

  if (existing) {
    return existing;
  }

  const [result] = await db
    .insert(projectTagAssignments)
    .values({ projectId, tagId })
    .returning();

  return result;
}

export async function removeTagFromProject(slugOrId: string, tagId: string) {
  const projectId = await resolveProjectId(slugOrId);

  const [result] = await db
    .delete(projectTagAssignments)
    .where(and(
      eq(projectTagAssignments.projectId, projectId),
      eq(projectTagAssignments.tagId, tagId),
    ))
    .returning();

  if (!result) {
    throw AppError.notFound('Tag not assigned to this project');
  }

  return result;
}

export async function getTagsForProject(slugOrId: string) {
  const projectId = await resolveProjectId(slugOrId);

  return db
    .select({
      id: projectTags.id,
      name: projectTags.name,
      color: projectTags.color,
    })
    .from(projectTagAssignments)
    .innerJoin(projectTags, eq(projectTagAssignments.tagId, projectTags.id))
    .where(eq(projectTagAssignments.projectId, projectId));
}
