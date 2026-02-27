import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/task.service.js';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await taskService.createTask({ ...req.body, requestorId: req.user!.id }, req.params.projectId as string);
    res.status(201).json({ data: task });
  } catch (error) {
    next(error);
  }
}

export async function createFromColumn(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await taskService.createTask({ ...req.body, requestorId: req.user!.id });
    res.status(201).json({ data: task });
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, priority, labelIds, dueBefore, dueAfter, columnId, page, pageSize } = req.query;
    const result = await taskService.getTasksByProject(req.params.projectId as string, {
      search: search as string,
      priority: priority as string,
      labelIds: labelIds ? (labelIds as string).split(',') : undefined,
      dueBefore: dueBefore as string,
      dueAfter: dueAfter as string,
      columnId: columnId as string,
      page: page ? parseInt(page as string, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize as string, 10) : undefined,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await taskService.getTaskById(req.params.id as string);
    res.json({ data: task });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await taskService.updateTask(req.params.id as string, req.body);
    res.json({ data: task });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await taskService.deleteTask(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function move(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await taskService.moveTask(req.params.id as string, req.body.columnId, req.body.position);
    res.json({ data: task });
  } catch (error) {
    next(error);
  }
}

export async function reorder(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await taskService.reorderTasks(req.body.tasks);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
}
