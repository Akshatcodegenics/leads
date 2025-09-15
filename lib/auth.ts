import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'demo',
      name: 'Demo Login',
      credentials: {},
      async authorize() {
        // Return demo user for development
        return {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'demo@example.com',
          name: 'Demo User',
          role: 'admin',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string || 'user';
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
  },
  session: {
    strategy: 'jwt',
  },
};

// Demo user for development
export const demoUser = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'demo@example.com',
  name: 'Demo User',
  role: 'admin',
};
