import { eq, asc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { taskResources } from '../db/schema/task-resources.js';
import { AppError } from '../utils/errors.js';

export async function getResourcesByTask(taskId: string) {
  return db
    .select()
    .from(taskResources)
    .where(eq(taskResources.taskId, taskId))
    .orderBy(asc(taskResources.createdAt));
}

export async function createResource(
  taskId: string,
  data: { title: string; url: string; resourceType?: string },
) {
  const [resource] = await db
    .insert(taskResources)
    .values({ ...data, taskId })
    .returning();

  return resource;
}

export async function deleteResource(id: string) {
  const [resource] = await db
    .delete(taskResources)
    .where(eq(taskResources.id, id))
    .returning();

  if (!resource) {
    throw AppError.notFound('Resource not found');
  }

  return resource;
}
