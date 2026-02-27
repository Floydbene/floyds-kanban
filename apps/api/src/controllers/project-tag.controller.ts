import { Request, Response, NextFunction } from 'express';
import * as projectTagService from '../services/project-tag.service.js';

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const tags = await projectTagService.getAllTags();
    res.json({ data: tags });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const tag = await projectTagService.createTag(req.body);
    res.status(201).json({ data: tag });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await projectTagService.deleteTag(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function assignToProject(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await projectTagService.assignTagToProject(
      req.params.projectId as string,
      req.params.tagId as string,
    );
    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function removeFromProject(req: Request, res: Response, next: NextFunction) {
  try {
    await projectTagService.removeTagFromProject(
      req.params.projectId as string,
      req.params.tagId as string,
    );
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
