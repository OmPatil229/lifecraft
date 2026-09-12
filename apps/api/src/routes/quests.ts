import { Router } from 'express';
import { getQuests, createQuest, updateQuest, deleteQuest, completeQuest } from '../controllers/quests';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', getQuests);
router.post('/', createQuest);
router.post('/:id/complete', completeQuest);
router.patch('/:id', updateQuest);
router.delete('/:id', deleteQuest);

export default router;
