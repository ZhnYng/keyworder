import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { UserButton } from '@clerk/nextjs';
import { Calendar, Image, Search } from "lucide-react";
import { format } from 'date-fns';
import SearchBar from "@/components/custom/search-bar";

const mockData = [
  { collectionName: "Summer Vacation", status: "Pending", imageCount: 120, createdAt: new Date(2023, 5, 15) },
  { collectionName: "Winter Wonderland", status: "Completed", imageCount: 8, createdAt: new Date(2023, 11, 20) },
  { collectionName: "Spring Blossoms", status: "Pending", imageCount: 10, createdAt: new Date(2024, 3, 22) },
  { collectionName: "Autumn Harvest", status: "Failed", imageCount: 5, createdAt: new Date(2023, 8, 30) },
  { collectionName: "Cityscapes", status: "Pending", imageCount: 7, createdAt: new Date(2024, 1, 10) },
];

export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || '';
  const filteredData = mockData.filter((data) =>
    data.collectionName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="grid min-h-screen w-full ">
      <div className="flex flex-col items-center">
        <main className="flex flex-col gap-4 p-4 md:gap-8 md:px-10 md:py-4 max-w-6xl">
          <h3 className="font-semibold tracking-tight">Collections</h3>
          <SearchBar placeholder="Search collections..."/>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredData.map((data, index) => (
              <Card key={index}>
                <CardHeader className="space-y-2">
                  <CardTitle>{data.collectionName}</CardTitle>
                  <CardDescription>
                    {data.status === "Failed" ? (
                      <Badge variant="destructive">{data.status}</Badge>
                    ) : data.status === "Completed" ? (
                      <Badge variant="success">{data.status}</Badge>
                    ) : (
                      <Badge variant="secondary">{data.status}</Badge>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: Math.min(data.imageCount, 6) }).map((_, imgIndex) => (
                      <img
                        key={imgIndex}
                        src="/placeholder.svg"
                        width={400}
                        height={400}
                        alt={`Product Image ${imgIndex + 1}`}
                        className="aspect-square rounded-md object-cover"
                      />
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-col w-full gap-4">
                    <div className="grid grid-cols-2">
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Image /> {data.imageCount} images
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar /> {format(data.createdAt, 'dd/MM/yyyy')}
                      </div>
                    </div>
                    <Link href={`/collections/${index}`} prefetch={false} className="self-end">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}