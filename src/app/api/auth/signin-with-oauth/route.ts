import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { signIn } from 'next-auth/react';
import { SignInWithOAuthSchema } from '@/src/lib/validation';
import { ValidationError } from '@/src/lib/http-errors';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Request Body:', body);

    const validatedData = SignInWithOAuthSchema.safeParse(body);

    if (!validatedData.success) {
      console.error('Validation Error:', validatedData.error.flatten().fieldErrors);
      return NextResponse.json({ error: validatedData.error.flatten().fieldErrors }, { status: 400 });
    }

    const { provider, providerAccountId, user } = validatedData.data;

    const token = await getToken({ req: request });
    if (token) {
      console.log('User already signed in:', token);
      return NextResponse.redirect('/dashboard');
    }

    const signInResponse = await signIn(provider, {
      callbackUrl: '/dashboard',
      providerAccountId,
      user,
    });

    if (signInResponse && signInResponse.error) {
      console.error('SignIn Error:', signInResponse.error);
      return NextResponse.json({ error: signInResponse.error }, { status: 400 });
    }

    console.log('SignIn Response:', signInResponse);
    return NextResponse.redirect('/dashboard');
  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json({ error: 'Unexpected Error', details: error.message }, { status: 500 });
  }
}
