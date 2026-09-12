import { Router } from 'express';
import {
  getQuests,
  getQuestById,
  createQuest,
  updateQuest,
  deleteQuest,
  completeQuest,
} from '../controllers/quests';
import { requireAuth } from '../middleware/auth';

const router = Router();

// All quest routes require authentication
router.use(requireAuth);

router.get('/', getQuests);
router.get('/:id', getQuestById);
router.post('/', createQuest);
router.post('/:id/complete', completeQuest);
router.patch('/:id', updateQuest);
router.delete('/:id', deleteQuest);

export default router;
