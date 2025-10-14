import { Router } from 'express';
import * as insightsController from '../controllers/insights';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/insights - Generate AI insights
router.get('/', insightsController.generateInsights);

// GET /api/insights/summary - Get spending summary (no AI)
router.get('/summary', insightsController.getSpendingSummary);

export default router;

