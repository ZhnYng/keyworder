"use client"

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { sendPasswordResetEmail } from "./actions";
import { useFormState } from "react-dom";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, WholeWord } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { redirect, useRouter } from "next/navigation";

export default function Page() {
  const [isPending, startTransition] = React.useTransition();
  const [state, action] = useFormState(sendPasswordResetEmail, { errors: {} })
  const router = useRouter();

  React.useEffect(() => {
    if (state.errors === null) {
      console.log("HERE")
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for a password reset link."
      })
    }

    const supabase = createClient();
    const getUser = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (user) {
        router.push("/");
      }
    }
    getUser();
  }, [state])

  return (
    <div className="flex h-full flex-col items-center justify-center bg-background p-6">
      <header className="mb-8 flex w-full max-w-md items-center justify-center">
        <Link href="#" prefetch={false}>
          <WholeWord className="h-8 w-8" />
          <span className="sr-only">Keyworder</span>
        </Link>
      </header>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Password Reset</CardTitle>
          <CardDescription>Enter your account email address.</CardDescription>
        </CardHeader>
        <form action={
          async (formData: FormData) => {
            startTransition(() => action(formData));
          }
        }>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" placeholder="email@example.com" required />
              {state.errors?.email && <div className="text-sm font-medium text-red-500">{state.errors.email.join(", ")}</div>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              {isPending ? <Loader2 className="animate-spin" /> : "Send reset email"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}