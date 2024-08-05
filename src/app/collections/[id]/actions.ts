"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type State = {
  errors?: {
    keyword?: string[];
    id?: string[];
    title?: string[];
    description?: string[];
  } | null;
};

const FormSchema = z.object({
  keyword: z.string().min(1),
  id: z.string().min(1),
});

export async function addKeyword(
  imageId: number,
  prevState: State,
  formData: FormData
) {
  const AddKeywordSchema = FormSchema.omit({ id: true });
  const validatedFields = AddKeywordSchema.safeParse({
    keyword: formData.get("keyword"),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // mutate data
  const supabase = createClient();
  const { error } = await supabase.from("keywords").insert({
    image_id: imageId,
    keyword: validatedFields.data.keyword,
  });
  if (error) {
    console.error(error);
    // return { errors: error.message }
  }

  // revalidate cache
  revalidatePath("/collections/[id]", "page");
  return { errors: null };
}

export async function deleteKeyword(formData: FormData) {
  // mutate data
  const supabase = createClient();
  const { error } = await supabase
    .from("keywords")
    .delete()
    .eq("id", formData.get("id")?.toString()!);
  if (error) {
    console.log(error);
  }

  // revalidate cache
  revalidatePath("/collections/[id]", "page");
}

const UpdateImageSchema = z.object({
  title: z.string().min(10),
  description: z.string().min(20),
});

export async function updateImage(
  imageId: number,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateImageSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // mutate data
  const supabase = createClient();
  const { error } = await supabase
    .from("images")
    .update({
      title: validatedFields.data.title,
      description: validatedFields.data.description,
    })
    .eq("id", imageId);
  if (error) {
    console.log(error);
  }

  // revalidate cache
  revalidatePath("/collections/[id]", "page");
  return { errors: null };
}