import { Schema, model, models, type Document, type Model } from 'mongoose';

const leadSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['enquiry', 'repair', 'reservation', 'sell', 'contact'],
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    email: { type: String, trim: true, lowercase: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    branch: {
      type: String,
      enum: ['lokhra', 'basistha', 'both'],
      default: 'both',
      index: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Closed'],
      default: 'New',
      index: true,
    },
    productTitle: { type: String, trim: true, maxlength: 180 },
    productSlug: { type: String, trim: true, maxlength: 180 },
    issueType: { type: String, trim: true, maxlength: 120 },
    photoUrl: { type: String, trim: true, maxlength: 700 },
    pickupTime: { type: String, trim: true, maxlength: 80 },
    source: { type: String, trim: true, maxlength: 120 },
  },
  { timestamps: true },
);

leadSchema.index({ createdAt: -1 });
leadSchema.index({ name: 'text', phone: 'text', message: 'text' });

export const LeadModel = (models.Lead || model('Lead', leadSchema)) as unknown as Model<Document>;
