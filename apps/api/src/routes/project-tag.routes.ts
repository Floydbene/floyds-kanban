import { Router } from 'express';
import { createProjectTagSchema } from '@taskflow/shared';
import * as projectTagController from '../controllers/project-tag.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);

router.get('/tags', projectTagController.list);
router.post('/tags', validate(createProjectTagSchema), projectTagController.create);
router.delete('/tags/:id', projectTagController.remove);
router.post('/projects/:projectId/tags/:tagId', projectTagController.assignToProject);
router.delete('/projects/:projectId/tags/:tagId', projectTagController.removeFromProject);

export default router;
