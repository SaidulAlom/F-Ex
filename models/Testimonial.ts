import { Schema, model, models, type Document, type Model } from 'mongoose';

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    quote: { type: String, required: true, trim: true, maxlength: 700 },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    approved: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export const TestimonialModel =
  (models.Testimonial || model('Testimonial', testimonialSchema)) as unknown as Model<Document>;
