import { Router } from 'express';
import transactionRoutes from './transactions';
import insightsRoutes from './insights';

const router = Router();

// Mount routes
router.use('/transactions', transactionRoutes);
router.use('/insights', insightsRoutes);

export default router;

