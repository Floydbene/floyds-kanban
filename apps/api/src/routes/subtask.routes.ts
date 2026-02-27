import { Router } from 'express';
import { createSubtaskSchema, updateSubtaskSchema } from '@taskflow/shared';
import * as subtaskController from '../controllers/subtask.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);

router.get('/tasks/:taskId/subtasks', subtaskController.listByTask);
router.post('/tasks/:taskId/subtasks', validate(createSubtaskSchema), subtaskController.create);
router.patch('/subtasks/:id', validate(updateSubtaskSchema), subtaskController.update);
router.delete('/subtasks/:id', subtaskController.remove);
router.patch('/tasks/:taskId/subtasks/reorder', subtaskController.reorder);

export default router;
