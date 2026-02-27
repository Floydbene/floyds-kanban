import { Request, Response, NextFunction } from 'express';
import * as columnService from '../services/column.service.js';

export async function listByBoard(req: Request, res: Response, next: NextFunction) {
  try {
    const cols = await columnService.getColumnsByBoard(req.params.boardId as string);
    res.json({ data: cols });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const column = await columnService.createColumn(req.params.boardId as string, req.body);
    res.status(201).json({ data: column });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const column = await columnService.updateColumn(req.params.id as string, req.body);
    res.json({ data: column });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await columnService.deleteColumn(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function reorder(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await columnService.reorderColumns(req.body.columns);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
}
