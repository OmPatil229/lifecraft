import { Request, Response } from 'express';
import { z } from 'zod';
import { Boss } from '../models/Boss';

const bossSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(['Work', 'Coding', 'Studying', 'Fitness', 'Reading', 'Meditation', 'Health', 'Personal']).default('Personal'),
  maxHp: z.number().int().min(10).max(2000).default(100),
  reward: z
    .object({
      xp: z.number().int().min(50).max(5000).default(500),
      gold: z.number().int().min(10).max(2000).default(200),
    })
    .optional(),
});

/**
 * GET /api/bosses
 * Returns all bosses for the authenticated user.
 */
export const getBosses = async (req: Request, res: Response): Promise<void> => {
  try {
    const bosses = await Boss.find({ userId: req.userId }).sort({ status: 1, createdAt: -1 });
    res.status(200).json(bosses);
  } catch (error) {
    console.error('Error fetching bosses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/bosses
 * Creates a new boss battle.
 */
export const createBoss = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = bossSchema.parse(req.body);

    const boss = new Boss({
      ...validatedData,
      currentHp: validatedData.maxHp,
      userId: req.userId,
      reward: validatedData.reward ?? { xp: 500, gold: 200 },
    });

    await boss.save();
    res.status(201).json(boss);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.issues });
      return;
    }
    console.error('Error creating boss:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * DELETE /api/bosses/:id
 * Abandons (removes) a boss battle.
 */
export const deleteBoss = async (req: Request, res: Response): Promise<void> => {
  try {
    const boss = await Boss.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!boss) {
      res.status(404).json({ error: 'Boss not found' });
      return;
    }
    res.status(200).json({ message: 'Boss abandoned' });
  } catch (error) {
    console.error('Error deleting boss:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
