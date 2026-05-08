import { Router } from 'express';
import { getProjects, createProject, deleteProject, addMember } from '../controllers/project.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getProjects);
router.post('/', authorizeRole(['ADMIN']), createProject);
router.delete('/:id', authorizeRole(['ADMIN']), deleteProject);
router.post('/:projectId/members', addMember);

export default router;
