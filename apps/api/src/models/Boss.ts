import mongoose, { Document, Schema } from 'mongoose';

export interface IBoss extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  category: 'Coding' | 'Studying' | 'Fitness' | 'Reading' | 'Meditation' | 'Health' | 'Personal';
  maxHp: number;
  currentHp: number;
  status: 'alive' | 'defeated';
  reward: {
    xp: number;
    gold: number;
  };
  defeatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BossSchema = new Schema<IBoss>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      enum: ['Coding', 'Studying', 'Fitness', 'Reading', 'Meditation', 'Health', 'Personal'],
      required: true,
      default: 'Personal',
    },
    maxHp: { type: Number, required: true, min: 1 },
    currentHp: { type: Number, required: true },
    status: {
      type: String,
      enum: ['alive', 'defeated'],
      default: 'alive',
      required: true,
    },
    reward: {
      xp: { type: Number, required: true, default: 500 },
      gold: { type: Number, required: true, default: 200 },
    },
    defeatedAt: { type: Date },
  },
  { timestamps: true }
);

export const Boss = mongoose.model<IBoss>('Boss', BossSchema);
