import { Schema, model, models, type Document, type Model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 160,
      index: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['Owner', 'BranchStaff'],
      default: 'BranchStaff',
    },
    branch: {
      type: String,
      enum: ['lokhra', 'basistha', 'both'],
      default: 'both',
    },
    passwordHash: { type: String, required: true, trim: true, maxlength: 200 },
  },
  { timestamps: true },
);

export const UserModel = (models.User || model('User', userSchema)) as unknown as Model<Document>;
