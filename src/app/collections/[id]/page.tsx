import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination"
import SearchBar from "@/components/custom/search-bar"
import { Download, Edit, XSquareIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/utils/supabase/server"
import ImageCard from "./images"

export default async function Page(
  {
    params,
    searchParams
  }: {
    params: { id: string };
    searchParams?: { query?: string }
  }
) {
  const supabase = createClient()

  const { data: collection, error: getCollectionError } = await supabase
    .from("collections")
    .select()
    .eq("id", params.id)
    .limit(1)
    .single()
  if (getCollectionError) {
    console.error(getCollectionError)
  }

  let { data: images, error } = await supabase
    .from("images")
    .select()
    .eq("collection_id", params.id)
    .order("id")
  if (error) {
    console.error(error)
  }
  images = images ?? []

  const filteredPhotos = images.filter((photo) => photo.title.toLowerCase().includes(searchParams?.query?.toLowerCase() || ""))

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{collection ? collection.name : 'NIL'}</h1>
          <div className="flex items-center mt-4 w-full gap-2">
            <SearchBar placeholder="Search photos..." />
            <Select>
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
            <Button>
              <Download className="mr-2" size={20} /> Download CSV
            </Button>
          </div>
        </header>
        <div className="grid grid-cols-1 gap-6">
          {filteredPhotos.map((photo) => (
            <ImageCard image={photo} key={photo.id}/>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          {/* <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === currentPage}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination> */}
        </div>
      </div>
    </div>
  )
}