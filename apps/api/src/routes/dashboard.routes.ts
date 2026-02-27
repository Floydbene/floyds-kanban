import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard/summary', dashboardController.summary);
router.get('/dashboard/throughput', dashboardController.throughput);
router.get('/dashboard/cycle-time', dashboardController.cycleTime);
router.get('/dashboard/priority-distribution', dashboardController.priorityDistribution);
router.get('/dashboard/label-distribution', dashboardController.labelDistribution);

export default router;
