import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import React from "react"
import Keywords from "./keywords"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Database } from "@/database.types"
import ImageCardView from "./image-card"

export default async function ImageCard(
  {
    image,
  }: {
    image: {
      collection_id: number;
      description: string;
      file_name: string;
      id: number;
      title: string;
    }
  }
) {
  const supabase = createClient()

  const { data: userData, error: getUserDataError } = await supabase.auth.getUser()
  if (getUserDataError || !userData?.user) {
    redirect('/login')
  }

  const { data: collection, error: getCollectionError } = await supabase
    .from("collections")
    .select()
    .eq("id", image.collection_id)
    .limit(1)
    .single()
  if (getCollectionError) {
    console.error(getCollectionError)
  }

  const { data: imageUrl, error: createSignedUrlsError } = await supabase
    .storage
    .from('stock_images')
    .createSignedUrl(`${userData.user.id}/${collection!.folder}/${image.file_name}`, 86400)
  if (createSignedUrlsError) {
    console.log(createSignedUrlsError);
  }

  const { data: keywords, error } = await supabase
    .from("keywords")
    .select()
    .eq("image_id", image.id)
  if (error) {
    console.error(error)
  }

  return (
    <ImageCardView
      image={image}
      imageUrl={imageUrl?.signedUrl || null}
      keywords={keywords}
    />
  )
}