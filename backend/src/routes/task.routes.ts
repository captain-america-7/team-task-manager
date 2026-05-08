import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateJWT, getTasks);
router.post('/', authenticateJWT, createTask);
router.put('/:id', authenticateJWT, updateTask);
router.delete('/:id', authenticateJWT, deleteTask);

export default router;
