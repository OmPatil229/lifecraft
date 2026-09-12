import mongoose, { Document, Schema } from 'mongoose';

export interface ICharacter extends Document {
  userId: mongoose.Types.ObjectId;
  level: number;
  totalXp: number;
  gold: number;
  attributes: {
    intelligence: number;
    strength: number;
    wisdom: number;
    focus: number;
    vitality: number;
  };
  streakDays: number;
  lastActivityDate: Date | null;
  unlockedSkills: string[];
  equippedItems: string[];
}

const CharacterSchema = new Schema<ICharacter>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    level: { type: Number, default: 1 },
    totalXp: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    attributes: {
      intelligence: { type: Number, default: 0 },
      strength: { type: Number, default: 0 },
      wisdom: { type: Number, default: 0 },
      focus: { type: Number, default: 0 },
      vitality: { type: Number, default: 0 },
    },
    streakDays: { type: Number, default: 0 },
    lastActivityDate: { type: Date, default: null },
    unlockedSkills: [{ type: String }],
    equippedItems: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const Character = mongoose.model<ICharacter>('Character', CharacterSchema);
