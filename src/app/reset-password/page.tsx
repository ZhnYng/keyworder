"use client"
import { createClient } from "@/utils/supabase/client";
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { sendPasswordResetEmail } from "./actions";
import { useFormState } from "react-dom";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, WholeWord } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const [isPending, startTransition] = React.useTransition();
  const [state, action] = useFormState(sendPasswordResetEmail, { errors: {} })
  /**
   * Step 1: Send the user an email to get a password reset token.
   * This email contains a link which sends the user back to your application.
   */

  /**
  * Step 2: Once the user is redirected back to your application,
  * ask the user to reset their password.
  */
  // const supabase = createClient()

  // React.useEffect(() => {
  //   supabase.auth.onAuthStateChange(async (event, session) => {
  //     if (event == "PASSWORD_RECOVERY") {
  //       const { data, error } = await supabase.auth
  //         .updateUser({ password: newPassword })

  //       if (data) alert("Password updated successfully!")
  //       if (error) alert("There was an error updating your password.")
  //     }
  //   })
  // }, [])

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
        <form action={
          async (formData: FormData) => {
            startTransition(() => action(formData));
          }
        }>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" placeholder="email@example.com" required />
              {state.errors?.email && <div className="text-sm text-red-500">{state.errors.email.join(", ")}</div>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              {isPending ? <Loader2 className="animate-spin" /> : "Sign in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}