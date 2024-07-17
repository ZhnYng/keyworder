"use client";

import { Button } from "@/components/ui/button"
import Sidebar from "@/components/sidebar"
import React from "react";

import { DropzoneOptions } from "react-dropzone";
import { CloudUpload } from "lucide-react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import FileUploaderComponent from "@/components/custom/file-uploader";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/extension/file-uploader";
export default function Page() {
  const dropzone = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    multiple: true,
    maxFiles: 500,
    maxSize: 1 * 1024 * 1024,
  } satisfies DropzoneOptions

  return (
      <div className="flex flex-1 flex-col items-center justify-center bg-background p-6 sm:p-8">
        <div className="max-w-4xl w-full">
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Generate Keywords</h1>
              <p className="text-muted-foreground">Easily upload and start generating accurate keywords, titles, and descriptions.</p>
            </div>
            <FileUploaderComponent dropzone={dropzone} />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Generate</Button>
          </div>
        </div>
      </div>
  )
}