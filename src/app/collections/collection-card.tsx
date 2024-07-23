import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/database.types";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import React from "react";
import { Calendar, LucideImage } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { redirect } from "next/navigation";

type Collection = Database["public"]["Tables"]["collections"]["Row"];

export default async function CollectionCard(
  {
    collection
  }: {
    collection: Collection;
  }
) {
  const supabase = createClient()
  const { data: userData, error } = await supabase.auth.getUser()
  if (error || !userData?.user) {
    redirect('/login')
  }

  const { data: collectionImages, error: listFolderError } = await supabase
    .storage
    .from('stock_images')
    .list(`${userData.user.id}/${collection.folder}`, {
      limit: 6,
      offset: 0
    })
  if (listFolderError) {
    console.log(listFolderError);
  }

  const { data: collectionImageUrls, error: createSignedUrlsError } = await supabase
    .storage
    .from('stock_images')
    .createSignedUrls(collectionImages!.map(image => `${userData.user.id}/${collection.folder}/${image.name}`), 86400)
  if (createSignedUrlsError) {
    console.log(createSignedUrlsError);
  }

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>{collection.name}</CardTitle>
        <div>
          {collection.status === "failed" ? (
            <Badge variant="destructive">{collection.status}</Badge>
          ) : collection.status === "completed" ? (
            <Badge variant="success" className="capitalize">{collection.status}</Badge>
          ) : (
            <Badge variant="secondary">{collection.status}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {collectionImageUrls && collectionImageUrls?.map((url, index) => (
            <Image
              key={url.path}
              src={url.signedUrl}
              width={400}
              height={400}
              alt={`Product Image ${index + 1}`}
              className="aspect-square rounded-md object-cover"
            />
          ))}
          {Array.from({ length: (6 - collectionImageUrls?.length!) }).map((_, index) => (
            <LucideImage 
              key={index} 
              className="text-muted-foreground w-full" 
              size={70}
              strokeWidth={1} 
            />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col w-full gap-4">
          <div className="grid grid-cols-2">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <LucideImage /> {collectionImageUrls ? collectionImageUrls.length : 0} images
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar /> {format(collection.createdat, 'dd/MM/yyyy')}
            </div>
          </div>
          <Link href={`/collections/${collection.id}`} prefetch={false} className="self-end">
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}