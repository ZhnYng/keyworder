import { createClient } from "@/utils/supabase/client"
import { z } from "zod";

export type State = {
  errors?: {
    email?: string[];
  } | null;
};

const emailSchema = z.object({
  email: z.string().email(),
})

export async function sendPasswordResetEmail(prevState: State, formData: FormData) {
  const validatedFields = emailSchema.safeParse({
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
  const { data, error } = await supabase.auth.resetPasswordForEmail(
    validatedFields.data.email, {
      redirectTo: `${window.location.origin}/reset-password/new-password`,
    }
  )

  if (error) {
    console.error(error)
  } else {
    return { errors: null }
  }
  
  console.log(data)
  return {}
}