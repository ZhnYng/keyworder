"use server"

import * as fastcsv from "fast-csv";
import fs from "fs";
import { redirect } from "next/navigation";
import { Database } from "@/database.types";
import { v4 as uuidv4 } from 'uuid';
import { createClient } from "@/utils/supabase/server";

type Collection = Database["public"]["Tables"]["collections"]["Row"];

export async function create_adobe_stock_csv(collection: Collection) {
  const supabase = createClient();

  const user = (await supabase.auth.getUser()).data.user
  if (!user) {
    redirect("/login")
  }

  const { data, error } = await supabase
    .from("images")
    .select(
      `
      file_name,
      title,
      adobe_stock_category,
      keywords (
        keyword
      )
    `)
    .eq("collection_id", collection.id);
  if (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }

  const headers = ["Filename", "Title", "Keywords", "Category", "Releases"];
  const csvStream = fastcsv.format({ headers });

  const filePath = `${uuidv4()}_adobe_stock_csv.csv`;
  const writableStream = fs.createWriteStream(filePath);

  writableStream.on('finish', async () => {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `${user.id}/${collection.folder}/${collection.name}_adobe_stock.csv`;
  
    const { data, error } = await supabase.storage
      .from('stock_images')
      .upload(fileName, fileBuffer, {
        upsert: true,
      })
  
    if (error) {
      console.error(error);
    }

    fs.unlink(filePath, (err) => {
      if (err) throw err;
    }); 
  });

  csvStream.pipe(writableStream);

  if (data) {
    data.forEach((item) => {
      const { file_name, title, keywords, adobe_stock_category } = item;
      const keywordsArray = keywords.map((keywordObj) => keywordObj.keyword);

      const transformedRow = {
        Filename: file_name,
        Title: title,
        Keywords: keywordsArray.join(", "),
        Category: adobe_stock_category,
        Releases: "", // Releases need to be done manually
      };

      csvStream.write(transformedRow);
    });
  }

  csvStream.end();
}
