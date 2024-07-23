"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type State = {
  errors?: {
    collectionName?: string[];
    images?: string[];
  } | null;
};

const FormSchema = z.object({
  collectionName: z.string().min(2).max(20),
  images: z.array(z.instanceof(File)).min(1),
});

export async function createCollection(prevState: State, formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    collectionName: formData.get("collectionName"),
    images: Array.from(formData.getAll("images")),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const collectionName = validatedFields.data.collectionName
  const images = validatedFields.data.images

  // upload images to cloud storage
  const supabase = createClient()
  const user = (await supabase.auth.getUser()).data.user
  if (!user) {
    redirect("/login")
  }

  for (const image of validatedFields.data.images) {
    const { data, error: imageUploadError } = await supabase
      .storage
      .from('stock_images')
      .upload(
        `${user.id}/${collectionName}/${image.name}`, image, {
        cacheControl: '3600',
        upsert: false
      })
    if (imageUploadError) {
      switch (imageUploadError.message) {
        case 'The resource already exists':
          return { errors: { images: ["One or more images already exist in this collection."] }}
        default:
          return { errors: { images: ["Error uploading image, try again later."] }}
      }
    }
  }
  
  const { error: createCollectionsError } = await supabase
    .from('collections')
    .insert({
      name: collectionName,
      email: user.email!,
      folder: collectionName,
      status: 'pending'
    })
  if (createCollectionsError) {
    console.error(createCollectionsError)
    return { errors: { collectionName: ["Error creating collection, try again later."] }}
  }
  
  // revalidate cache
  revalidatePath('/collections', "page");
  redirect("/collections")
}