import { Schema, model, models, type Document, type Model } from 'mongoose';

const imageSchema = new Schema(
  {
    url: { type: String, required: true, trim: true, maxlength: 600 },
    publicId: { type: String, trim: true, maxlength: 300 },
    alt: { type: String, required: true, trim: true, maxlength: 180 },
  },
  { _id: false },
);

const specsSchema = new Schema(
  {
    ram: { type: String, trim: true, maxlength: 80 },
    storage: { type: String, trim: true, maxlength: 80 },
    color: { type: String, trim: true, maxlength: 80 },
    display: { type: String, trim: true, maxlength: 120 },
    processor: { type: String, trim: true, maxlength: 120 },
    camera: { type: String, trim: true, maxlength: 120 },
    connectivity: { type: String, trim: true, maxlength: 120 },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    brand: { type: String, required: true, trim: true, maxlength: 60 },
    category: {
      type: String,
      required: true,
      enum: ['new-phone', 'second-hand', 'accessory', 'gadget', 'landline'],
      index: true,
    },
    condition: {
      type: String,
      required: true,
      enum: ['New', 'Pre-owned', 'Refurbished', 'Accessory'],
      index: true,
    },
    price: { type: Number, min: 0, default: null },
    callForPrice: { type: Boolean, default: false },
    shortDescription: { type: String, required: true, trim: true, maxlength: 260 },
    description: { type: String, required: true, trim: true, maxlength: 4000 },
    specs: { type: specsSchema, default: {} },
    images: { type: [imageSchema], required: true, validate: (v: unknown[]) => v.length > 0 },
    batteryHealth: { type: String, trim: true, maxlength: 60 },
    warranty: { type: String, trim: true, maxlength: 120 },
    grade: { type: String, enum: ['A', 'B', 'C', ''], default: undefined },
    status: {
      type: String,
      required: true,
      enum: ['Available', 'Reserved', 'Sold'],
      default: 'Available',
      index: true,
    },
    branch: {
      type: String,
      required: true,
      enum: ['lokhra', 'basistha', 'both'],
      default: 'both',
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

productSchema.index({ featured: -1, createdAt: -1 });
productSchema.index({ title: 'text', brand: 'text', shortDescription: 'text' });

export const ProductModel = (models.Product ||
  model('Product', productSchema)) as unknown as Model<Document>;
