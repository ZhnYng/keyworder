"use client"
import { Button } from "@/components/ui/button"
import { Database } from "@/database.types"
import { Edit, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Keywords from "./keywords"
import React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { updateImage } from "./actions"
import { useFormState } from "react-dom"
import { toast } from "@/components/ui/use-toast"

export default function ImageCard(
  {
    image,
    imageUrl,
    keywords
  }: {
    image: Database['public']['Tables']['images']['Row'],
    imageUrl: string | null,
    keywords: Database['public']['Tables']['keywords']['Row'][] | null
  }
) {
  const [isPending, startTransition] = React.useTransition();
  const [editing, setEditing] = React.useState(false)
  const updateImageBinded = updateImage.bind(null, image.id)
  const [state, action] = useFormState(updateImageBinded, { errors: {} })

  React.useEffect(() => {
    if (!state.errors) {
      setEditing(false)
      toast({
        title: "Success",
        description: "Title and description updated successfully",
      });
    }
  }, [state.errors]);

  return (
    <div key={image.id} className="flex items-start gap-4">
      <div className="relative overflow-hidden rounded-lg">
        <Link href={imageUrl || ''} className="absolute inset-0 z-10" prefetch={false}>
          <span className="sr-only">View {imageUrl}</span>
        </Link>
        <Image
          src={imageUrl || ''}
          alt={image.title}
          width={400}
          height={400}
          priority={true}
          className="w-40 h-40 object-cover group-hover:opacity-50 transition-opacity"
        />
      </div>
      {editing ?
        <div className="flex-1">
          <form action={
            async (formData: FormData) => {
              startTransition(() => action(formData));
            }
          }>
            <div className="flex justify-between gap-2">
              <div className="flex flex-col flex-[6]">
                <Input
                  type="text"
                  className="text-lg font-semibold"
                  defaultValue={image.title}
                  name="title"
                />
                <div id="title-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.title &&
                    state.errors.title.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
              <Button
                variant="default"
                size="icon"
                type="submit"
                className="flex-1"
              >
                {isPending ? <Loader2 className="size-5 animate-spin" /> : <>Save</>}
                <span className="sr-only">Save</span>
              </Button>
            </div>
            <Textarea
              className="text-sm text-muted-foreground mt-2"
              defaultValue={image.description}
              name="description"
            />
            <div id="description-error" aria-live="polite" aria-atomic="true">
              {state.errors?.description &&
                state.errors.description.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </form>
          <Keywords imageId={image.id} keywords={keywords} />
        </div>
        :
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{image.title}</h3>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent text-muted-foreground"
              onClick={() => setEditing(true)}
            >
              <Edit className="size-5" />
              <span className="sr-only">Edit title</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{image.description}</p>
          <Keywords imageId={image.id} keywords={keywords} />
        </div>
      }
    </div>
  )
}