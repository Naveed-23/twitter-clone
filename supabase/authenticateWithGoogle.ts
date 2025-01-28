import { supabase } from './supabase';

export const authenticateWithGoogle = async (idToken: string) => {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
  });

  if (error) {
    console.error('Supabase authentication failed:', error.message);
    throw new Error('Supabase authentication failed');
  }

  // Return the session if it exists
  return data?.session || null;
};
