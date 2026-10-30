import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from '@/lib/data/users';
import { isDemoAdminConfigured, isDemoMode } from '@/lib/env';
import { loginSchema } from '@/lib/validators';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  pages: { signIn: '/admin/login' },
  providers: [
    CredentialsProvider({
      name: 'Email and password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const email = parsed.data.email.toLowerCase();

        const user = await findUserByEmail(email).catch((error) => {
          console.error('[F-Ex Store] User lookup failed.', error);
          return null;
        });
        if (user?.passwordHash) {
          const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
          if (!valid) return null;
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            branch: user.branch,
          };
        }

        // Explicit, opt-in preview login. Never active when MONGODB_URI is set.
        if (
          isDemoMode() &&
          isDemoAdminConfigured() &&
          email === process.env.DEMO_OWNER_EMAIL?.toLowerCase().trim() &&
          parsed.data.password === process.env.DEMO_OWNER_PASSWORD
        ) {
          return {
            id: 'demo-owner',
            name: 'Demo Owner',
            email,
            role: 'Owner',
            branch: 'both',
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.branch = user.branch;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id || token.sub || '';
        session.user.role = token.role || 'BranchStaff';
        session.user.branch = token.branch || 'lokhra';
      }
      return session;
    },
  },
};
