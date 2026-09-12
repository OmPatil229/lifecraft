import { Request, Response } from 'express';
import { Character } from '../models/Character';

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
