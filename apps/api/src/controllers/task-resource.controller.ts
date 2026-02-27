import { Request, Response, NextFunction } from 'express';
import * as taskResourceService from '../services/task-resource.service.js';

export async function listByTask(req: Request, res: Response, next: NextFunction) {
  try {
    const resources = await taskResourceService.getResourcesByTask(req.params.taskId as string);
    res.json({ data: resources });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const resource = await taskResourceService.createResource(req.params.taskId as string, req.body);
    res.status(201).json({ data: resource });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await taskResourceService.deleteResource(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
