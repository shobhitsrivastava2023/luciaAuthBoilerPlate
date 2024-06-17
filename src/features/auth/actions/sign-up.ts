'use server';

import { generateId } from 'lucia';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Argon2id } from 'oslo/password';
import { lucia } from '@/lib/lucia';
import { prisma } from '@/lib/prisma';

const signUp = async (formDataRaw: FormData) => {
    const firstName = formDataRaw.get('firstName') as string;
    const lastName = formDataRaw.get('lastName') as string;
    const email = formDataRaw.get('email') as string ;
    const password = formDataRaw.get('password') as string;
    const confirmPassword = formDataRaw.get('confirmPassword') as string;
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        // Handle missing fields
        throw new Error('All fields are required.');
    }

    if (password !== confirmPassword) {
        // Handle password mismatch
        throw new Error('Passwords do not match.');
    }

    // console.log(formDataRaw); <- remove
  
    try {
        const hashedPassword = await new Argon2id().hash(password);
        const userId = generateId(15);

        await prisma.user.create({
            data: {
                id: userId,
                firstName,
                lastName,
                email,
                hashedPassword,
            },
        });

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );
    } catch (error) {
      // TODO: add error feedback yourself
      // https://www.robinwieruch.de/next-forms/
      // TODO: add error handling if user email is already taken
      // The Road to Next
    }
  
    redirect('/dashboard');
  };

export { signUp };
