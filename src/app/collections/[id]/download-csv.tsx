"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import SearchBar from "@/components/custom/search-bar"
import { Download, Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useTransition } from "react"
import { Database } from "@/database.types"
import { create_adobe_stock_csv } from "./csv-actions"
import { redirect } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

type Collection = Database["public"]["Tables"]["collections"]["Row"];

export default function DownloadCSV({ collection }: { collection: Collection }) {
  const [isPending, startTransition] = useTransition()

  return (
    <form className="flex gap-2 items-center" action={(formData: FormData) => {
      startTransition(async () => {
        if (!formData.get("agency")) {
          toast({
            title: "Please select an agency.",
            variant: "destructive"
          })
          return
        }

        const supabase = createClient();
        const user = (await supabase.auth.getUser()).data.user
        if (!user) {
          redirect("/login")
        }

        if (formData.get("agency") === "adobe_stock") {
          const response = await create_adobe_stock_csv(collection)
          if (response?.error) {
            toast({
              title: "Something went wrong! Try again.😢",
              variant: "destructive"
            })
            console.error(response.error)
            return
          }

          const file_name = `${collection.name}_adobe_stock.csv`
          const { data, error } = await supabase
            .storage
            .from('stock_images')
            .download(`${user.id}/${collection.folder}/${file_name}`)
          if (error) {
            toast({
              title: "Something went wrong! Try again.😢",
              variant: "destructive"
            })
            console.error(error)
            return
          }

          const url = window.URL.createObjectURL(data!);
          const link = document.createElement("a");
          link.href = url;
          link.download = file_name;
          document.body.appendChild(link);

          link.click();

          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      })
    }}>
      <Select name="agency">
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select an agency" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Agency</SelectLabel>
            <SelectItem value="adobe_stock">Adobe Stock</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {isPending ?
        <Button disabled className="w-40">
          <Loader2 className="animate-spin" />
        </Button>
        :
        <Button type="submit" className="w-40">
          <Download className="mr-2" size={20} /> Download CSV
        </Button>
      }
    </form>
  )
}