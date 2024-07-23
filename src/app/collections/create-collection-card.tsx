import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, LucideImage } from "lucide-react";
import Link from "next/link";

export default function CreateCollectionCard() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>Create Collection</CardTitle>
        <div>
          <Badge variant="default">New</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <div className="grid grid-cols-3 w-full">
          {Array.from({ length: 6 }).map((_, index) => (
            <LucideImage key={index} className="text-muted-foreground w-full" size={70} strokeWidth={1}/>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col w-full gap-4">
          <div className="grid grid-cols-2">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <LucideImage /> 0 images
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar /> ---/--/----
            </div>
          </div>
          <Link href="/collections/create" prefetch={false} className="self-end">
            <Button size="sm">
              New Collection
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}