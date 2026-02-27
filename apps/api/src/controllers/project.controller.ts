import { Request, Response, NextFunction } from 'express';
import * as projectService from '../services/project.service.js';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectService.createProject(req.body, req.user!.id);
    res.status(201).json({ data: project });
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const projects = await projectService.getProjects(req.user!.id);
    res.json({ data: projects });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectService.getProjectById(req.params.id as string, req.user!.id);
    res.json({ data: project });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectService.updateProject(req.params.id as string, req.body, req.user!.id);
    res.json({ data: project });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await projectService.deleteProject(req.params.id as string, req.user!.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function archive(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectService.archiveProject(req.params.id as string, req.user!.id);
    res.json({ data: project });
  } catch (error) {
    next(error);
  }
}
