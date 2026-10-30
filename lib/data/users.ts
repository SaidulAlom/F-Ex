import { UserModel } from '@/models/User';
import { isDatabaseConfigured } from '@/lib/env';
import { connectToDatabase } from '@/lib/mongodb';
import { serializeDocument } from '@/lib/serialization';
import type { AdminUser, ProductBranch } from '@/lib/types';

export async function findUserByEmail(email: string): Promise<AdminUser | null> {
  if (!isDatabaseConfigured()) return null;
  await connectToDatabase();
  const document = await UserModel.findOne({ email: email.toLowerCase().trim() }).lean();
  return document ? serializeDocument<AdminUser>(document) : null;
}

export async function createStaffUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  branch: ProductBranch;
}): Promise<AdminUser> {
  if (!isDatabaseConfigured()) throw new Error('MONGODB_URI is required to create staff users');
  await connectToDatabase();
  const document = await UserModel.create({ ...input, role: 'BranchStaff' });
  return serializeDocument<AdminUser>(document);
}
