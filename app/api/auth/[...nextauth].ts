import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import connectToDatabase from '@/lib/mongodb'; // Updated to use connectToDatabase
import { verifyPassword } from '@/lib/auth';

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // const client = await connectToDatabase();
                // const db = client.db();

                // const user = await db.collection('users').findOne({ email: credentials?.email });

                // if (user && await verifyPassword(credentials?.password, user.password)) {
                // return { id: user._id.toString(), name: user.name, email: user.email };
                return { id: "asdas", name: "sdsa", email: "sdfds" };
                // } else {
                //     return null;
                // }
                // return null
            }
        }),
    ],
    // adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: 'jwt',
    },
    jwt: {
        secret: process.env.JWT_SECRET as string, // Ensure JWT_SECRET is a string
    },
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub as string;
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
    },
});
