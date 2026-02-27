import { Request, Response, NextFunction } from 'express';
import * as subtaskService from '../services/subtask.service.js';

export async function listByTask(req: Request, res: Response, next: NextFunction) {
  try {
    const subtasks = await subtaskService.getSubtasksByTask(req.params.taskId as string);
    res.json({ data: subtasks });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const subtask = await subtaskService.createSubtask(req.params.taskId as string, req.body);
    res.status(201).json({ data: subtask });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const subtask = await subtaskService.updateSubtask(req.params.id as string, req.body);
    res.json({ data: subtask });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await subtaskService.deleteSubtask(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function reorder(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await subtaskService.reorderSubtasks(req.body.subtasks);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
}
