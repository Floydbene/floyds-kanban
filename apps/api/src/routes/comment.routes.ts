import { Router } from 'express';
import { createCommentSchema, updateCommentSchema } from '@taskflow/shared';
import * as commentController from '../controllers/comment.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);

router.get('/tasks/:taskId/comments', commentController.listByTask);
router.post('/tasks/:taskId/comments', validate(createCommentSchema), commentController.create);
router.patch('/comments/:id', validate(updateCommentSchema), commentController.update);
router.delete('/comments/:id', commentController.remove);

export default router;
