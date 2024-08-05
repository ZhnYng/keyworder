"use server"

import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache";

const supabase = createClient()

type Collection = Database["public"]["Tables"]["collections"]["Row"];

export const deleteCollection = async (collection: Collection) => {
  const userData = (await supabase.auth.getUser()).data.user!

  await supabase
    .from('runs')
    .delete()
    .eq('collection_id', collection.id)

  const { data: imageData, error: getImageDataError } = await supabase
    .from('images')
    .delete()
    .eq('collection_id', collection.id)
    .select()
  if (getImageDataError) {
    console.error(getImageDataError)
    return { deleted: false }
  }

  if (imageData) {
    await supabase.from('keywords')
      .delete().in('image_id', imageData.map((image: any) => image.id))
  }

  const { data: images, error: getImagesError } = await supabase
    .storage
    .from("stock_images")
    .list(`${userData.id}/${collection.folder}`)
  if (getImagesError) {
    console.error(getImagesError)
    return { deleted: false }
  }

  if (images) {
    const filesToRemove = images.map((x) => `${userData.id}/${collection.folder}/${x.name}`);
    const { data, error } = await supabase.storage.from("stock_images").remove(filesToRemove);
    if (error) {
      console.error(error)
      return { deleted: false }
    }
  }

  await supabase
    .from('collections')
    .delete()
    .eq('id', collection.id)

  revalidatePath("/collections", "page")
  return { deleted: true }
}