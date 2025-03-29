import { Router } from 'express';
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  applyForJob,
  getApplications,
  getRecommendedJobs
} from '../controllers/job.controller';
import { checkRole } from '../middleware/role.middleware';

const router = Router();

// Public routes
router.get('/', getJobs);
router.get('/recommended', getRecommendedJobs);
router.get('/:id', getJob);

// Protected routes
router.post('/', checkRole(['HR', 'ADMIN']), createJob);
router.put('/:id', checkRole(['HR', 'ADMIN']), updateJob);
router.delete('/:id', checkRole(['HR', 'ADMIN']), deleteJob);
router.post('/:id/apply', applyForJob);
router.get('/applications/me', getApplications);

export { router as jobRouter };