import { Router } from 'express';
import { createProjectSchema, updateProjectSchema } from '@taskflow/shared';
import * as projectController from '../controllers/project.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createProjectSchema), projectController.create);
router.get('/', projectController.list);
router.get('/:id', projectController.getById);
router.patch('/:id', validate(updateProjectSchema), projectController.update);
router.delete('/:id', projectController.remove);
router.patch('/:id/archive', projectController.archive);

export default router;
