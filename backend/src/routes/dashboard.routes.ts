import { Router } from 'express';
import { getStats } from '../controllers/dashboard.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/stats', getStats);

export default router;
