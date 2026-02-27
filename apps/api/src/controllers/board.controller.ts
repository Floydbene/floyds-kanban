import { Request, Response, NextFunction } from 'express';
import * as boardService from '../services/board.service.js';

export async function getDefaultBoard(req: Request, res: Response, next: NextFunction) {
  try {
    const board = await boardService.getDefaultBoardWithColumns(req.params.projectId as string);
    res.json({ data: board });
  } catch (error) {
    next(error);
  }
}

export async function getWithColumns(req: Request, res: Response, next: NextFunction) {
  try {
    const board = await boardService.getBoardWithColumns(req.params.id as string);
    res.json({ data: board });
  } catch (error) {
    next(error);
  }
}

export async function listByProject(req: Request, res: Response, next: NextFunction) {
  try {
    const boards = await boardService.getBoardsByProject(req.params.projectId as string);
    res.json({ data: boards });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const board = await boardService.createBoard({
      ...req.body,
      projectId: req.params.projectId as string,
    });
    res.status(201).json({ data: board });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const board = await boardService.updateBoard(req.params.id as string, req.body);
    res.json({ data: board });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await boardService.deleteBoard(req.params.id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
