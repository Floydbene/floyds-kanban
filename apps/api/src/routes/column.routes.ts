import { Router } from 'express';
import { createColumnSchema, updateColumnSchema, reorderColumnsSchema } from '@taskflow/shared';
import * as columnController from '../controllers/column.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);

router.get('/boards/:boardId/columns', columnController.listByBoard);
router.post('/boards/:boardId/columns', validate(createColumnSchema), columnController.create);
router.patch('/boards/:boardId/columns/reorder', validate(reorderColumnsSchema), columnController.reorder);
router.patch('/columns/:id', validate(updateColumnSchema), columnController.update);
router.delete('/columns/:id', columnController.remove);

export default router;
