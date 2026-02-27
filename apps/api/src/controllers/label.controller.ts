import { Request, Response, NextFunction } from 'express';
import * as labelService from '../services/label.service.js';

export async function listByProject(req: Request, res: Response, next: NextFunction) {
  try {
    const labels = await labelService.getLabelsByProject(req.params.projectId as string);
    res.json({ data: labels });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const label = await labelService.createLabel(req.params.projectId as string, req.body);
    res.status(201).json({ data: label });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const label = await labelService.updateLabel(req.params.id as string, req.body);
    res.json({ data: label });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await labelService.deleteLabel(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function addToTask(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await labelService.addLabelToTask(req.params.taskId as string, req.params.labelId as string);
    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function removeFromTask(req: Request, res: Response, next: NextFunction) {
  try {
    await labelService.removeLabelFromTask(req.params.taskId as string, req.params.labelId as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
