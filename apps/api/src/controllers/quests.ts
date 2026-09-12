import { Request, Response } from 'express';
import { z } from 'zod';
import { Quest } from '../models/Quest';
import { Character } from '../models/Character';
import { QuestCompletion } from '../models/QuestCompletion';
import { Boss } from '../models/Boss';
import { calculateQuestReward, mapCategoryToAttribute, processLevelUps, getStreakMultiplier, calculateNewStreak } from '../utils/engine';

// Accept any non-empty string for dueDate; controller will parse it
const questSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z
    .enum(['Coding', 'Studying', 'Fitness', 'Reading', 'Meditation', 'Health', 'Personal'])
    .default('Personal'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Epic']).default('Medium'),
  dueDate: z.string().optional(),
});

/**
 * GET /api/quests
 * Returns all quests for the authenticated user, newest first.
 */
export const getQuests = async (req: Request, res: Response): Promise<void> => {
  try {
    const quests = await Quest.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(quests);
  } catch (error) {
    console.error('Error fetching quests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/quests/:id
 * Returns a single quest by ID, scoped to the authenticated user.
 */
export const getQuestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const quest = await Quest.findOne({ _id: req.params.id, userId: req.userId });
    if (!quest) {
      res.status(404).json({ error: 'Quest not found' });
      return;
    }
    res.status(200).json(quest);
  } catch (error) {
    console.error('Error fetching quest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/quests
 * Creates a new quest for the authenticated user.
 */
export const createQuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = questSchema.parse(req.body);

    const quest = new Quest({
      ...validatedData,
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
      userId: req.userId,
    });

    await quest.save();
    res.status(201).json(quest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Error creating quest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PATCH /api/quests/:id
 * Updates an existing quest, scoped to the authenticated user.
 */
export const updateQuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = questSchema.partial().parse(req.body);

    const updatePayload: any = { ...validatedData };
    if (validatedData.dueDate !== undefined) {
      updatePayload.dueDate = validatedData.dueDate ? new Date(validatedData.dueDate) : undefined;
    }

    const quest = await Quest.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: updatePayload },
      { new: true }
    );

    if (!quest) {
      res.status(404).json({ error: 'Quest not found' });
      return;
    }

    res.status(200).json(quest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Error updating quest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * DELETE /api/quests/:id
 * Permanently removes a quest, scoped to the authenticated user.
 */
export const deleteQuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const quest = await Quest.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!quest) {
      res.status(404).json({ error: 'Quest not found' });
      return;
    }

    res.status(200).json({ message: 'Quest deleted successfully' });
  } catch (error) {
    console.error('Error deleting quest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/quests/:id/complete
 * Atomically marks a quest as completed and awards XP, Gold, and attribute points.
 * Uses findOneAndUpdate with { status: 'active' } filter to guarantee idempotency —
 * a quest can only ever be completed once.
 */
export const completeQuest = async (req: Request, res: Response): Promise<void> => {
  try {
    // Step 1: Atomically mark quest as completed.
    // If status is not 'active', this returns null, preventing double-completion.
    const quest = await Quest.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId, status: 'active' },
      { $set: { status: 'completed', completedAt: new Date() } },
      { new: true }
    );

    if (!quest) {
      res.status(400).json({ error: 'Quest not found or already completed' });
      return;
    }

    // Step 2: Calculate rewards based on quest difficulty and category
    const reward = calculateQuestReward(quest.difficulty);
    const attribute = mapCategoryToAttribute(quest.category);

    // Step 3: Load and update the character document
    const character = await Character.findOne({ userId: req.userId });
    if (!character) {
      res.status(404).json({ error: 'Character not found' });
      return;
    }

    const oldStreakDays = character.streakDays; // snapshot before mutation
    const newStreak = calculateNewStreak(character.streakDays, character.lastActivityDate);
    const multiplier = getStreakMultiplier(newStreak);
    const baseXp = reward.xp;
    const bonusXp = Math.floor(baseXp * (multiplier - 1));
    const totalXpGained = baseXp + bonusXp;

    character.streakDays = newStreak;
    character.lastActivityDate = new Date();

    // Step 5: Apply rewards. XP and gold are added first.
    character.totalXp += totalXpGained;
    character.gold += reward.gold;

    // Step 6: Increment the attribute associated with the quest category
    (character.attributes as any)[attribute] = ((character.attributes as any)[attribute] || 0) + 1;

    // Step 7: Calculate level-ups AFTER totalXp has been updated.
    const levelUpResult = processLevelUps(character.level, character.totalXp);
    const didLevelUp = levelUpResult.levelsGained > 0;

    if (didLevelUp) {
      character.level = levelUpResult.newLevel;
    }

    // Step 8: Persist character changes
    await character.save();

    // Step 8b: Deal damage to any alive boss that matches the quest category
    const DAMAGE_BY_DIFFICULTY: Record<string, number> = {
      Easy: 5, Medium: 15, Hard: 30, Epic: 60,
    };
    const damage = DAMAGE_BY_DIFFICULTY[quest.difficulty] ?? 15;

    let bossDefeated: any = null;
    const aliveBoss = await Boss.findOne({
      userId: req.userId,
      category: quest.category,
      status: 'alive',
    });

    if (aliveBoss) {
      aliveBoss.currentHp = Math.max(0, aliveBoss.currentHp - damage);
      const isDefeated = aliveBoss.currentHp === 0;
      if (isDefeated) {
        aliveBoss.status = 'defeated';
        aliveBoss.defeatedAt = new Date();
        // Grant boss defeat reward on top of quest reward
        character.totalXp += aliveBoss.reward.xp;
        character.gold += aliveBoss.reward.gold;
        bossDefeated = aliveBoss.toObject();
        // Save the updated character (with boss bonus) before saving the boss
        await character.save();
      }
      await aliveBoss.save();
    }

    // Step 8: Log the completion for auditing and idempotency
    const completion = new QuestCompletion({
      questId: quest._id,
      userId: req.userId,
      rewardSnapshot: { ...reward, levelUp: didLevelUp },
    });
    await completion.save();

    // Step 9: Return result so the UI can show reward toast / level-up modal
    res.status(200).json({
      quest,
      reward: {
        ...reward,
        xp: totalXpGained,   // return multiplied XP so toast is accurate
        baseXp,
        bonusXp,
        multiplier,
      },
      streak: {
        days: newStreak,
        multiplier,
        isNew: newStreak !== oldStreakDays,
      },
      levelUp: didLevelUp,
      newLevel: character.level,
      levelsGained: levelUpResult.levelsGained,
      character: {
        level: character.level,
        totalXp: character.totalXp,
        gold: character.gold,
        attributes: character.attributes,
        streakDays: character.streakDays,
      },
      bossDamage: aliveBoss ? { bossId: aliveBoss._id, damage, remainingHp: aliveBoss.currentHp } : null,
      bossDefeated,
    });
  } catch (error) {
    console.error('Error completing quest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};