import mongoose, { Document, Schema } from 'mongoose';

export interface IQuest extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  category: 'Work' | 'Coding' | 'Studying' | 'Fitness' | 'Reading' | 'Meditation' | 'Health' | 'Personal';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
  status: 'active' | 'completed' | 'failed';
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuestSchema = new Schema<IQuest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      enum: ['Work', 'Coding', 'Studying', 'Fitness', 'Reading', 'Meditation', 'Health', 'Personal'],
      default: 'Personal',
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'Epic'],
      default: 'Medium',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'failed'],
      default: 'active',
      required: true,
    },
    dueDate: { type: Date },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const Quest = mongoose.model<IQuest>('Quest', QuestSchema);
