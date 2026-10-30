import { config as loadEnv } from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';

loadEnv({ path: '.env.local' });
loadEnv();

async function main() {
  const uri = process.env.MONGODB_URI?.trim();
  const name = process.env.STAFF_NAME?.trim() || 'Branch Staff';
  const email = (process.env.STAFF_EMAIL || '').toLowerCase().trim();
  const password = process.env.STAFF_PASSWORD || '';
  const branch = process.env.STAFF_BRANCH === 'basistha' ? 'basistha' : 'lokhra';

  if (!uri) throw new Error('Set MONGODB_URI in .env.local first');
  if (!email.includes('@')) throw new Error('Set a valid STAFF_EMAIL');
  if (password.length < 8) throw new Error('STAFF_PASSWORD must be at least 8 characters');

  await mongoose.connect(uri);
  const passwordHash = await bcrypt.hash(password, 12);
  await UserModel.findOneAndUpdate(
    { email },
    { $set: { name, email, role: 'BranchStaff', branch, passwordHash } },
    { upsert: true, new: true, runValidators: true },
  );
  console.log(`BranchStaff ${email} is ready for the ${branch} branch.`);
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
