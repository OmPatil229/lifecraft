import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestCompletion extends Document {
  questId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  completedAt: Date;
  rewardSnapshot: {
    xp: number;
    gold: number;
    levelUp: boolean;
  };
  idempotencyKey?: string;
}

const QuestCompletionSchema = new Schema<IQuestCompletion>(
  {
    questId: { type: Schema.Types.ObjectId, ref: 'Quest', required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    completedAt: { type: Date, default: Date.now },
    rewardSnapshot: {
      xp: { type: Number, required: true },
      gold: { type: Number, required: true },
      levelUp: { type: Boolean, required: true, default: false },
    },
    idempotencyKey: { type: String },
  },
  {
    timestamps: true,
  }
);

export const QuestCompletion = mongoose.model<IQuestCompletion>('QuestCompletion', QuestCompletionSchema);
