"use client"
import { z } from "zod"
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import FileUploaderComponent from "@/components/custom/file-uploader";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { createCollection } from "./actions";
import { useFormState } from "react-dom";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  collectionName: z.string().min(2).max(20),
})

export default function Page() {
  const supabase = createClient()

  React.useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        redirect('/login')
      }
    }
    getUser()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collectionName: "",
    },
  })

  const [files, setFiles] = React.useState<File[] | null>(null);
  const uploadMessageRef = React.useRef<HTMLParagraphElement>(null);
  const [state, action] = useFormState(createCollection, { errors: {} })
  const [isPending, startTransition] = React.useTransition();

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!files) {
      uploadMessageRef.current!.textContent = "Please upload at least one image."
      return
    }
    uploadMessageRef.current!.textContent = null

    const formData = new FormData()
    formData.append("collectionName", values.collectionName)
    files.forEach(file => formData.append("images", file))
    startTransition(() => action(formData))
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background p-6 sm:p-8">
      <div className="max-w-4xl w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <h1 className="text-4xl font-bold">New Collection</h1>
            <FormField
              control={form.control}
              name="collectionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter collection name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of your collection.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div id="title-error" aria-live="polite" aria-atomic="true">
              {state.errors?.collectionName &&
                state.errors.collectionName.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
            <div>
              <FormLabel>Your Images</FormLabel>
              <FormDescription>
                Upload the images you want accurate keywords, titles, and descriptions for.
              </FormDescription>
              <FileUploaderComponent
                dropzone={{
                  accept: {
                    'image/jpeg': [],
                    'image/png': [],
                  },
                  multiple: true,
                  maxFiles: 200,
                  maxSize: 45 * 1024 * 1024, // 45MB based on Adobe Stock
                }}
                files={files} setFiles={setFiles}
              />
              <p
                ref={uploadMessageRef}
                className={cn("text-sm font-medium text-destructive")}
              />
              <div id="title-error" aria-live="polite" aria-atomic="true">
                {state.errors?.images &&
                  state.errors.images.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div className="flex justify-end w-full">
              {isPending ? 
                <Button type="submit" disabled className="w-1/6">
                  <Loader2 className="size-5 animate-spin" /> 
                </Button>
                : 
                <Button type="submit" className="w-1/6">Submit</Button>
              }
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}