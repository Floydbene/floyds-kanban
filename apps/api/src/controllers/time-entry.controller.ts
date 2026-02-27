import { Request, Response, NextFunction } from 'express';
import * as timeEntryService from '../services/time-entry.service.js';

export async function start(req: Request, res: Response, next: NextFunction) {
  try {
    const entry = await timeEntryService.startTimer(req.user!.id, req.body);
    res.status(201).json({ data: entry });
  } catch (error) {
    next(error);
  }
}

export async function stop(req: Request, res: Response, next: NextFunction) {
  try {
    const entry = await timeEntryService.stopTimer(req.user!.id);
    res.json({ data: entry });
  } catch (error) {
    next(error);
  }
}

export async function active(req: Request, res: Response, next: NextFunction) {
  try {
    const entry = await timeEntryService.getActiveTimer(req.user!.id);
    res.json({ data: entry });
  } catch (error) {
    next(error);
  }
}

export async function manual(req: Request, res: Response, next: NextFunction) {
  try {
    const entry = await timeEntryService.createManualEntry(req.user!.id, req.body);
    res.status(201).json({ data: entry });
  } catch (error) {
    next(error);
  }
}

export async function listByTask(req: Request, res: Response, next: NextFunction) {
  try {
    const entries = await timeEntryService.getEntriesByTask(req.params.taskId as string);
    res.json({ data: entries });
  } catch (error) {
    next(error);
  }
}
