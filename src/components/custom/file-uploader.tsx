"use client";

import React from 'react';
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/extension/file-uploader";
import { CloudUpload } from 'lucide-react';
import Image from 'next/image';
import { DropzoneOptions } from "react-dropzone";

export default function FileUploaderComponent({dropzone}: {dropzone: DropzoneOptions}) {
  const [files, setFiles] = React.useState<File[] | null>(null);

  return (
    <FileUploader
      value={files}
      onValueChange={setFiles}
      dropzoneOptions={dropzone}
      className="relative bg-background rounded-lg p-2 space-y-10"
    >
      <FileInput className="outline-dashed outline-1 outline-black p-6">
        <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
          <CloudUpload size={40} />
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span>
            &nbsp; or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or GIF
          </p>
        </div>
      </FileInput>
      <FileUploaderContent className="grid grid-cols-3 sm:grid-cols-5 gap-4 justify-items-center">
        {files?.map((file, i) => (
          <FileUploaderItem
            key={i}
            index={i}
            className="size-20 p-0 rounded-md overflow-hidden"
            aria-roledescription={`file ${i + 1} containing ${file.name}`}
          >
            <Image
              src={URL.createObjectURL(file)}
              alt={file.name}
              height={80}
              width={80}
            />
          </FileUploaderItem>
        ))}
      </FileUploaderContent>
    </FileUploader>
  );
};