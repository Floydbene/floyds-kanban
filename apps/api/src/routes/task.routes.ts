import { Router } from 'express';
import { createTaskSchema, updateTaskSchema, moveTaskSchema, reorderTasksSchema } from '@taskflow/shared';
import * as taskController from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);

router.post('/projects/:projectId/tasks', validate(createTaskSchema), taskController.create);
router.get('/projects/:projectId/tasks', taskController.list);
router.post('/tasks', validate(createTaskSchema), taskController.createFromColumn);
router.get('/tasks/:id', taskController.getById);
router.patch('/tasks/:id', validate(updateTaskSchema), taskController.update);
router.delete('/tasks/:id', taskController.remove);
router.patch('/tasks/:id/move', validate(moveTaskSchema), taskController.move);
router.patch('/tasks/reorder', validate(reorderTasksSchema), taskController.reorder);

export default router;
