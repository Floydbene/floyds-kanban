import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service.js';

export async function summary(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await dashboardService.getSummary(req.query.projectId as string | undefined, req.user!.id);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function throughput(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await dashboardService.getThroughput(req.query.projectId as string | undefined, req.user!.id);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function cycleTime(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await dashboardService.getCycleTime(req.query.projectId as string | undefined, req.user!.id);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function priorityDistribution(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await dashboardService.getPriorityDistribution(req.query.projectId as string | undefined, req.user!.id);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function labelDistribution(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await dashboardService.getLabelDistribution(req.query.projectId as string | undefined, req.user!.id);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}
