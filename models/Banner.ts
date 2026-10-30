import { Schema, model, models, type Document, type Model } from 'mongoose';

const bannerSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    subtitle: { type: String, required: true, trim: true, maxlength: 320 },
    badge: { type: String, trim: true, maxlength: 80 },
    ctaLabel: { type: String, required: true, trim: true, maxlength: 60 },
    ctaHref: { type: String, required: true, trim: true, maxlength: 240 },
    image: { type: String, required: true, trim: true, maxlength: 700 },
    imageAlt: { type: String, required: true, trim: true, maxlength: 180 },
    type: { type: String, enum: ['hero', 'offer'], default: 'offer', index: true },
    active: { type: Boolean, default: true, index: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    position: { type: Number, default: 0 },
    theme: { type: String, enum: ['navy', 'blue', 'orange'], default: 'navy' },
  },
  { timestamps: true },
);

export const BannerModel = (models.Banner || model('Banner', bannerSchema)) as unknown as Model<Document>;
