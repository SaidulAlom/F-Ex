import { config as loadEnv } from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { BannerModel } from '../models/Banner';
import { BranchModel } from '../models/Branch';
import { LeadModel } from '../models/Lead';
import { ProductModel } from '../models/Product';
import { TestimonialModel } from '../models/Testimonial';
import { UserModel } from '../models/User';
import {
  makeSeedOwner,
  sampleBanners,
  sampleBranches,
  sampleLeads,
  sampleProducts,
  sampleTestimonials,
} from '../lib/seed-data';

loadEnv({ path: '.env.local' });
loadEnv();

function withoutLocalId<T extends { id?: string; createdAt?: string; updatedAt?: string }>(
  item: T,
): Omit<T, 'id' | 'createdAt' | 'updatedAt'> {
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = item;
  void _id;
  void _createdAt;
  void _updatedAt;
  return rest;
}

async function main() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error('Set MONGODB_URI in .env.local before running npm run seed');

  const email = (process.env.SEED_OWNER_EMAIL || 'owner@fexstore.in').toLowerCase();
  const password = process.env.SEED_OWNER_PASSWORD || 'ChangeMe123!';
  if (password.length < 8) throw new Error('SEED_OWNER_PASSWORD must be at least 8 characters');

  await mongoose.connect(uri);
  console.log('Connected. Replacing F-Ex Store sample collections…');

  await Promise.all([
    ProductModel.deleteMany({}),
    BranchModel.deleteMany({}),
    LeadModel.deleteMany({}),
    BannerModel.deleteMany({}),
    TestimonialModel.deleteMany({}),
    UserModel.deleteMany({}),
  ]);

  await Promise.all([
    ProductModel.init(),
    BannerModel.init(),
    TestimonialModel.init(),
    UserModel.init(),
  ]);

  const passwordHash = await bcrypt.hash(password, 12);
  const owner = makeSeedOwner(passwordHash);
  const branches = sampleBranches().map((branch) => ({
    slug: branch.slug,
    phone: branch.phone,
    address: branch.address,
    hours: branch.hours,
  }));

  const [products, branchDocs, leads, banners, testimonials, admins] = await Promise.all([
    ProductModel.insertMany(sampleProducts.map(withoutLocalId)),
    BranchModel.insertMany(branches),
    LeadModel.insertMany(sampleLeads.map(withoutLocalId)),
    BannerModel.insertMany(
      sampleBanners.map((banner) => ({
        ...withoutLocalId(banner),
        startDate: new Date(banner.startDate),
        endDate: new Date(banner.endDate),
      })),
    ),
    TestimonialModel.insertMany(sampleTestimonials.map(withoutLocalId)),
    UserModel.create({
      name: owner.name,
      email: owner.email,
      role: owner.role,
      branch: owner.branch,
      passwordHash: owner.passwordHash,
    }),
  ]);

  console.log('Seed complete:');
  console.log(`  Products:      ${products.length}`);
  console.log(`  Branches:      ${branchDocs.length}`);
  console.log(`  Banners:       ${banners.length}`);
  console.log(`  Testimonials:  ${testimonials.length}`);
  console.log(`  Leads:         ${leads.length}`);
  console.log(`  Admin users:   ${admins ? 1 : 0}`);
  console.log(`  Owner login:   ${email}`);
  console.log('  Owner password comes from SEED_OWNER_PASSWORD (or the documented local default).');
  console.log('IMPORTANT: this script deletes existing data in these collections.');

  await mongoose.disconnect();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });
