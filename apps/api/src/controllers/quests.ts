import { Request, Response } from 'express';
import { z } from 'zod';
import { Quest } from '../models/Quest';

const questSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(['Coding', 'Studying', 'Fitness', 'Reading', 'Meditation', 'Health', 'Personal']).default('Personal'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Epic']).default('Medium'),
  dueDate: z.string().datetime().optional(),
});

export const getQuests = async (req: Request, res: Response): Promise<void> => {
  try {
    const quests = await Quest.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(quests);
  } catch (error) {
    console.error('Error fetching quests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createQuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = questSchema.parse(req.body);
    
    const quest = new Quest({
      ...validatedData,
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

export const updateQuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = questSchema.partial().parse(req.body);
    
    const quest = await Quest.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: validatedData },
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
