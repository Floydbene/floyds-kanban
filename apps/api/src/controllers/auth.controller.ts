import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.getMe(req.user!.id);
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await authService.listUsers();
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
}
