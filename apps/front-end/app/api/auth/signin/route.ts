import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ISignInRequest } from '@/libs/types-api/src';
import { signIn } from '@/libs/web-apis/src';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const signInData: ISignInRequest = { email, password };

    const result = await signIn(signInData);
    if (result.statusCode === 200 || result.statusCode === 201) {
      const cookieStore = await cookies();
      cookieStore.set('cricketAnalysisToken', result.data.token, { httpOnly: true });

      return NextResponse.json({ status: result.statusCode });

    } else {
      return NextResponse.json(
        { error: 'Error while signing in' },
        { status: result.statusCode }
      );
    }
  } catch (error) {
    console.error('Error during sign-in:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}