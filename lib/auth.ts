import { compare } from 'bcryptjs'; // For password hashing
import { NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';

// Function to verify passwords
export async function verifyPassword(plainTextPassword: any, hashedPassword: string): Promise<boolean> {
    return compare(plainTextPassword, hashedPassword);
}

// Function to get session from request
export async function getAuthSession(req: NextApiRequest) {
    const session = await getSession({ req });
    return session;
}
