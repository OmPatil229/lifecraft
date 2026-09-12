import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  displayName: string;
  class: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    class: {
      type: String,
      required: true,
      default: 'Adventurer',
    },
    timezone: {
      type: String,
      required: true,
      default: 'UTC',
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
