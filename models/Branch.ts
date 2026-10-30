import { Schema, model, models, type Document, type Model } from 'mongoose';

const hourSchema = new Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 80 },
    days: { type: [Number], required: true },
    open: { type: String, required: true, trim: true, maxlength: 5 },
    close: { type: String, required: true, trim: true, maxlength: 5 },
  },
  { _id: false },
);

const branchSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      enum: ['lokhra', 'basistha'],
    },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    address: { type: String, required: true, trim: true, maxlength: 600 },
    hours: { type: [hourSchema], required: true, validate: (v: unknown[]) => v.length > 0 },
  },
  { timestamps: true },
);

export const BranchModel = (models.Branch || model('Branch', branchSchema)) as unknown as Model<Document>;
