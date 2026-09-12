import { Router } from 'express';
import { getQuests, createQuest, updateQuest, deleteQuest } from '../controllers/quests';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', getQuests);
router.post('/', createQuest);
router.patch('/:id', updateQuest);
router.delete('/:id', deleteQuest);

export default router;
