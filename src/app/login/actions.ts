'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod';

export type State = {
  errors?: {
    email?: string[];
    password?: string[];
  } | null;
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function login(prevState: State, formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  })

  if (error) {
    console.log(error.message)
    if (error.message === 'Invalid login credentials') {
      return {
        errors: {
          email: ['Email may be incorrect'],
          password: ['Password may be incorrect'],
        },
      }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error(error)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}