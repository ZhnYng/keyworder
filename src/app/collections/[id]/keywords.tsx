"use client";
import React, { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { addKeyword, deleteKeyword } from "./actions";
import { Button } from "@/components/ui/button";
import { Loader2, XIcon } from "lucide-react";
import { useFormState } from "react-dom";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/database.types";

type Keyword = Database["public"]["Tables"]["keywords"]["Row"];

export default function Keywords({ imageId, keywords }: {
  imageId: number;
  keywords: Keyword[] | null;
}) {
  const [isPending, startTransition] = React.useTransition();
  const [optimisticKeywords, setOptimisticKeywords] = React.useOptimistic(keywords);
  const { toast } = useToast();
  const addKeywordBinded = addKeyword.bind(null, imageId);
  const [state, action] = useFormState(addKeywordBinded, { errors: {} });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.errors?.keyword) {
      for (const error of state.errors.keyword) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error,
        });
      }
    }
  }, [state.errors]);

  return (
    <div className="flex flex-wrap gap-2 mt-2 items-center">
      {optimisticKeywords &&
        optimisticKeywords.map((keyword) => (
          <div className="bg-muted text-muted-foreground rounded-md text-xs flex items-center px-1" key={keyword.id}>
            <span className="px-1 py-1">{keyword.keyword}</span>
            <form
              className="flex items-center"
              action={
                async (formData: FormData) => {
                  setOptimisticKeywords(optimisticKeywords.filter((k) => k.id !== keyword.id));
                  startTransition(() => deleteKeyword(formData));
                }
              }
            >
              <input name="id" className="hidden" defaultValue={keyword.id} />
              <Button
                variant="ghost"
                size="icon"
                type="submit"
                className="w-4 h-4 hover:bg-transparent text-muted-foreground"
              >
                <XIcon />
                <span className="sr-only">Remove keyword</span>
              </Button>
            </form>
          </div>
        ))}
      <form
        className="bg-muted text-muted-foreground rounded-md text-xs flex items-center gap-1"
        action={
          async (formData: FormData) => {
            const keyword = formData.get('keyword')?.toString() || '';
            setOptimisticKeywords([
              ...optimisticKeywords!,
              {
                created_at: "",
                id: optimisticKeywords!.length + 1,
                image_id: imageId,
                keyword: keyword,
                user_id: ""
              }
            ]);
            if (inputRef.current) {
              inputRef.current.value = '';
            }
            startTransition(() => action(formData));
          }
        }
      >
        <Input
          ref={inputRef}
          type="text"
          placeholder="Add keyword"
          name="keyword"
          className="bg-transparent focus:outline-none text-xs px-2 py-1 h-6 w-24"
        />
      </form>
      {isPending && <Loader2 className="animate-spin size-5"/>}
    </div>
  );
}