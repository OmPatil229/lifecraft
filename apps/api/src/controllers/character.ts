import { Request, Response } from 'express';
import { Character } from '../models/Character';
import { Quest } from '../models/Quest';

export const getCharacter = async (req: Request, res: Response): Promise<void> => {
  try {
    let character = await Character.findOne({ userId: req.userId });
    
    // Fallback: create character if it doesn't exist for some reason
    if (!character) {
      character = new Character({ userId: req.userId });
      await character.save();
    }
    
    res.status(200).json(character);
  } catch (error) {
    console.error('Error fetching character:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 365); // Past 365 days for 1-year heatmap grid

    const completedQuests = await Quest.find({
      userId: req.userId,
      status: 'completed',
      completedAt: { $gte: startDate }
    });

    const activityMap: Record<string, number> = {};
    completedQuests.forEach(quest => {
      if (quest.completedAt) {
        const dateStr = new Date(quest.completedAt).toISOString().split('T')[0];
        activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
      }
    });

    res.status(200).json({
      activity: activityMap,
      totalCompleted: completedQuests.length
    });
  } catch (error) {
    console.error('Error fetching activity history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
