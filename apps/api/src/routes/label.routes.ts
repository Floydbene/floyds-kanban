import { Router } from 'express';
import { createLabelSchema, updateLabelSchema } from '@taskflow/shared';
import * as labelController from '../controllers/label.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);

router.get('/projects/:projectId/labels', labelController.listByProject);
router.post('/projects/:projectId/labels', validate(createLabelSchema), labelController.create);
router.patch('/labels/:id', validate(updateLabelSchema), labelController.update);
router.delete('/labels/:id', labelController.remove);
router.post('/tasks/:taskId/labels/:labelId', labelController.addToTask);
router.delete('/tasks/:taskId/labels/:labelId', labelController.removeFromTask);

export default router;
