import { Router } from 'express';
import { getBosses, createBoss, deleteBoss } from '../controllers/bosses';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', getBosses);
router.post('/', createBoss);
router.delete('/:id', deleteBoss);

export default router;
