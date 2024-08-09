"use server";

import { generateMetadata } from "@/trigger/generate";
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

  const supabase = createClient()
  const user = (await supabase.auth.getUser()).data.user
  if (!user) {
    redirect("/login")
  }

  const { data: customer, error: getCustomerError } = await supabase
    .from("customers")
    .select()
    .eq("user_id", user.id)
    .maybeSingle()
  if (getCustomerError) {
    console.error(getCustomerError)
    return { errors: { collectionName: ["Error creating collection, try again later."] }}
  }

  if (!customer || customer.subscription_status !== "ACTIVE") {
    return { errors: { images: ["Payment details required. Visit billing to get started."] }}
  }

  // create collection record in database
  const { data: newCollectionRow, error: createCollectionsError } = await supabase
    .from('collections')
    .insert({
      name: collectionName,
      email: user.email!,
      folder: collectionName,
      status: 'pending',
      user_id: user.id
    })
    .select()
    .single()
  if (createCollectionsError) {
    if (createCollectionsError.code === "23505") {
      return { errors: { collectionName: ["Collection name already exists."] }}
    } else {
      console.error(createCollectionsError)
      return { errors: { collectionName: ["Error creating collection, try again later."] }}
    }
  }
  
  const uploadedPaths:string[] = [] // array to store all uploaded image paths

  // upload images to cloud storage
  await Promise.all(images.map(async (image) => {
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
          return { errors: { images: ["Error uploading images, try again later."] }}
      }
    }

    uploadedPaths.push(data.path)
  }));

  // generate metadata for each image
  generateImageMetadata(uploadedPaths, newCollectionRow.id, customer.stripe_customer_id)
  
  // revalidate cache
  revalidatePath('/collections', "page");
  redirect("/collections")
}

export async function generateImageMetadata(imagePaths: string[], collectionId: number, stripe_customer_id: string) {
  const supabase = createClient();

  // trigger run to generate title, description, keywords for each image
  await Promise.all(imagePaths.map(async (path) => {
    // create signed url for image
    const { data: imageUrl, error: createSignedUrlsError } = await supabase
      .storage
      .from('stock_images')
      .createSignedUrl(path, 604800);
    if (createSignedUrlsError) {
      console.error(createSignedUrlsError);
    }
    
    // trigger generateMetadata function on trigger.dev
    const handle = await generateMetadata.trigger({
      imageUrl: imageUrl?.signedUrl!,
      fileName: path.split('/').pop()!,
      stripe_customer_id: stripe_customer_id
    });

    // store runId in db
    const { error: insertRunError } = await supabase
      .from('runs')
      .insert({
        collection_id: collectionId,
        file_name: path.split('/').pop()!,
        run_id: handle.id
      });
    if (insertRunError) {
      console.error(insertRunError);
    }
  }));
}