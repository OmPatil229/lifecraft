import { Router } from 'express';
import { getCharacter } from '../controllers/character';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', getCharacter);

export default router;
