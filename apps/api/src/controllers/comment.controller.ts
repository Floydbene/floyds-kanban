import { Request, Response, NextFunction } from 'express';
import * as commentService from '../services/comment.service.js';

export async function listByTask(req: Request, res: Response, next: NextFunction) {
  try {
    const comments = await commentService.getCommentsByTask(req.params.taskId as string);
    res.json({ data: comments });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const comment = await commentService.createComment(req.params.taskId as string, req.user!.id, req.body);
    res.status(201).json({ data: comment });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const comment = await commentService.updateComment(req.params.id as string, req.user!.id, req.body);
    res.json({ data: comment });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await commentService.deleteComment(req.params.id as string, req.user!.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
