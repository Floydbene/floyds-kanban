import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/me', authenticate, authController.me);
router.get('/users', authenticate, authController.listUsers);

export default router;
