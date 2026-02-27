import { Router } from 'express';
import { createResourceSchema } from '@taskflow/shared';
import * as taskResourceController from '../controllers/task-resource.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);

router.get('/tasks/:taskId/resources', taskResourceController.listByTask);
router.post('/tasks/:taskId/resources', validate(createResourceSchema), taskResourceController.create);
router.delete('/resources/:id', taskResourceController.remove);

export default router;
