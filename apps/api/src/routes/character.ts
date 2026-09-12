import { Router } from 'express';
import { getCharacter, getActivity } from '../controllers/character';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', getCharacter);
router.get('/activity', getActivity);

export default router;
