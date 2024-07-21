import React from "react";
import SearchBar from "@/components/custom/search-bar";
import { createClient } from '@/utils/supabase/server'
import { redirect } from "next/navigation";
import CollectionCard from "./collection-card";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const supabase = createClient()
  const { data: userData, error } = await supabase.auth.getUser()
  if (error || !userData?.user) {
    redirect('/login')
  }

  let { data: collections, error: getCollectionsError } = await supabase
    .from('collections')
    .select()
    .eq('email', userData.user.email!)
  if (getCollectionsError) {
    console.log(getCollectionsError);
  }
  collections = collections ?? []

  const query = searchParams?.query || '';
  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="grid w-full ">
      <div className="flex flex-col items-center w-full">
        <main className="flex flex-col gap-4 p-4 md:gap-8 md:px-10 md:py-4 max-w-6xl w-full">
          <h3 className="font-semibold tracking-tight">Collections</h3>
          <SearchBar placeholder="Search collections..." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCollections.map((collection) => (
              <CollectionCard collection={collection} key={collection.id}/>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}