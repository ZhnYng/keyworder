"use client"
import { createClient } from "@/utils/supabase/client";
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, WholeWord } from "lucide-react";
import { z } from "zod";
import Link from "next/link";

const passwordSchema = z.object({
  password: z.string().min(8),
})

export default function Page() {
  const [isPending, startTransition] = React.useTransition()
  const [password, setPassword] = React.useState<string>()
  const [errors, setErrors] = React.useState<string[]>()

  const supabase = createClient()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validatedFields = passwordSchema.safeParse({
      password: password,
    });

    if (validatedFields.error) {
      setErrors(validatedFields.error.flatten().fieldErrors.password)
      return
    }

    startTransition(async () => {
      const { data, error } = await supabase.auth
        .updateUser({ password: validatedFields.data.password })

      console.log(data)
      console.error(error)

      if (data) alert("Password updated successfully!")
      if (error) alert("There was an error updating your password.")
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <header className="mb-8 flex w-full max-w-md items-center justify-center">
        <Link href="#" prefetch={false}>
          <WholeWord className="h-8 w-8" />
          <span className="sr-only">Keyworder</span>
        </Link>
      </header>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Password Reset</CardTitle>
          <CardDescription>Enter your account email.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" placeholder="" 
              value={password} onChange={(e) => setPassword(e.target.value)} required />
              {errors && <div className="text-sm text-red-500">{errors.join(", ")}</div>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              {isPending ? <Loader2 className="animate-spin" /> : "Reset Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}