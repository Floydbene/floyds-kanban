import { Router } from 'express';
import { createTimeEntrySchema, manualTimeEntrySchema } from '@taskflow/shared';
import * as timeEntryController from '../controllers/time-entry.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);

router.post('/time-entries/start', validate(createTimeEntrySchema), timeEntryController.start);
router.post('/time-entries/stop', timeEntryController.stop);
router.get('/time-entries/active', timeEntryController.active);
router.post('/time-entries/manual', validate(manualTimeEntrySchema), timeEntryController.manual);
router.get('/tasks/:taskId/time-entries', timeEntryController.listByTask);

export default router;
