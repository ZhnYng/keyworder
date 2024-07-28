import { Button } from "@/components/ui/button"
import React from "react";
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { DropzoneOptions } from "react-dropzone";
import FileUploaderComponent from "@/components/custom/file-uploader";

export default async function Page() {
  redirect('/collections')
}