"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Database } from "@/database.types"
import { Loader2, Trash2 } from "lucide-react"
import React from "react"
import { deleteCollection } from "./actions"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Collection = Database["public"]["Tables"]["collections"]["Row"];

export default function DeleteCollectionBtn({ collection }: { collection: Collection }) {
  const [isDeleting, startDeleting] = React.useTransition()
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will <span className="font-medium text-destructive">permanently delete {collection.name}</span> and remove all its data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form action={() => startDeleting(async () => {
            const response = await deleteCollection(collection)
            if (response.deleted) {
              setOpen(false)
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
              <Button size="sm" variant="destructive" className="w-24" disabled>
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button type="submit" variant="destructive" className="gap-1 w-24"><Trash2 size={20} />Delete</Button>
            )}
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}