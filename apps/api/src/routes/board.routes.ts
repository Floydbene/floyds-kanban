import { Router } from 'express';
import * as boardController from '../controllers/board.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/projects/:projectId/board', boardController.getDefaultBoard);
router.get('/projects/:projectId/boards', boardController.listByProject);
router.post('/projects/:projectId/boards', boardController.create);
router.get('/boards/:id', boardController.getWithColumns);
router.patch('/boards/:id', boardController.update);
router.delete('/boards/:id', boardController.remove);

export default router;
