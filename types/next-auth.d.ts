import type { DefaultSession } from 'next-auth';
import type { AdminRole, ProductBranch } from '@/lib/types';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      role: AdminRole;
      branch: ProductBranch;
    };
  }

  interface User {
    role: AdminRole;
    branch: ProductBranch;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: AdminRole;
    branch?: ProductBranch;
  }
}
