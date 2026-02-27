import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { projects } from '../db/schema/projects.js';
import { AppError } from './errors.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Accepts either a UUID or a slug and returns the project UUID.
 */
export async function resolveProjectId(slugOrId: string): Promise<string> {
  if (UUID_RE.test(slugOrId)) return slugOrId;

  const [project] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.slug, slugOrId))
    .limit(1);

  if (!project) throw AppError.notFound('Project not found');
  return project.id;
}
