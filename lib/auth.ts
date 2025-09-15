import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Demo Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'demo@example.com' },
      },
      async authorize(credentials) {
        // Demo mode - accept any email
        if (credentials?.email) {
          return {
            id: '550e8400-e29b-41d4-a716-446655440000',
            email: credentials.email,
            name: 'Demo User',
            role: 'user',
          };
        }
        return null;
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
