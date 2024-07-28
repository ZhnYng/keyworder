import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination"
import SearchBar from "@/components/custom/search-bar"
import { Download, Edit, XSquareIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { runs } from "@trigger.dev/sdk/v3";

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

  const user = (await supabase.auth.getUser()).data.user! // Ensured by middleware because it is a protected route

  const { data: runData, error: getRunError } = await supabase
    .rpc('get_latest_runs_in_collection', { p_collection_id: parseInt(params.id) }); // Runs a database function
  if (getRunError) {
    console.error(getRunError)
  }

  // Saves the generated metadata into db upon completion
  await Promise.all(runData!.map(async (run) => {
    const runResult = await runs.retrieve(run.run_id) // get run information from trigger
    if (runResult.isCompleted) { // if run is completed on trigger.dev, collect the output
      const {
        title,
        description,
        keywords,
        fileName
      }: {
        title: string;
        description: string;
        keywords: string[],
        fileName: string
      } = runResult.output

      // Store the image metadata into the database
      // On duplicate error, skip insert
      const { data: newImageData, error: insertImageError } = await supabase
        .from("images")
        .insert({
          collection_id: parseInt(params.id),
          title: title,
          description: description,
          file_name: fileName,
          user_id: user.id
        })
        .select()
        .single()
      if (
        insertImageError && 
        insertImageError.code !== "23505" // Duplicate error
      ) {
        console.error(insertImageError)
      }

      if (newImageData) {
        // Store the keywords into the database
        await Promise.all(keywords.map(async (keyword) => {
          const { error: insertKeywordError } = await supabase
            .from("keywords")
            .insert({
              image_id: newImageData.id,
              keyword: keyword,
            })
          if (insertKeywordError) {
            console.error(insertKeywordError)
          }
        }))
      }

      // Update the runs table to keep up to date with run status from trigger.dev
      const { error: updateRunsError } = await supabase
        .from("runs")
        .update({
          status: runResult.status
        })
        .eq("run_id", runResult.id)
      if (updateRunsError) {
        console.error(updateRunsError)
      }
    }
  }))

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

  const filteredImages = images.filter((image) => image.title.toLowerCase().includes(searchParams?.query?.toLowerCase() || ""))

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
          {filteredImages.map((image) => (
            <ImageCard image={image} key={image.id} />
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