"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Database } from "@/database.types"
import { Loader2, Trash2 } from "lucide-react"
import React from "react"
import { deleteCollection } from "./actions"

type Collection = Database["public"]["Tables"]["collections"]["Row"];

export default function DeleteCollectionBtn({ collection }: { collection: Collection }) {
  const [isDeleting, startDeleting] = React.useTransition()
  
  return (
    <form action={() => startDeleting(async () => {
      const response = await deleteCollection(collection)
      if (response.deleted) {
        toast({
          title: "Collection deleted!",
        })
      } else {
        toast({
          title: 'Error deleting collection',
          description: 'Error deleting images from collection',
          variant: 'destructive'
        })
      }
    })}>
      {isDeleting ? (
        <Button size="sm" variant="outline" disabled>
          <Loader2 className="animate-spin" />
        </Button>
      ) : (
        <Button size="sm" variant="outline">
          <Trash2 />
        </Button>
      )}
    </form>
  )
}