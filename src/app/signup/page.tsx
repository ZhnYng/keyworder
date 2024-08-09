"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, WholeWord } from "lucide-react"
import React from "react"
import { signup } from "./actions"
import { useFormState } from "react-dom"
import { toast } from "@/components/ui/use-toast"

export default function Page() {
  const [isPending, startTransition] = React.useTransition();
  const [state, action] = useFormState(signup, { errors: {} })

  return (
    <div className="flex h-full flex-col items-center justify-center bg-background">
      <header className="mb-8 flex w-full max-w-md items-center justify-center">
        <Link href="#" prefetch={false} className="flex gap-1 items-center">
          <WholeWord className="h-8 w-8" />
          <span className="font-bold text-xl">Keyworder</span>
        </Link>
      </header>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome!</CardTitle>
          <CardDescription>Enter a valid email and password to sign up.</CardDescription>
        </CardHeader>
        <form action={
          async (formData: FormData) => {
            startTransition(() => {
              action(formData)
              toast({
                title: "Check your inbox to verify your account.",
              })
            });
          }
        }>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" placeholder="email@example.com" required />
              {state.errors?.email && <div className="text-sm text-red-500">{state.errors.email.join(", ")}</div>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" name="password" type="password" required />
              {state.errors?.password && <div className="text-sm text-red-500">{state.errors.password.join(", ")}</div>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              {isPending ? <Loader2 className="animate-spin"/> : "Register"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium underline" prefetch={false}>
          Login
        </Link>
      </div>
    </div>
  )
}